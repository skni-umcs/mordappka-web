import { ClassDataDTO } from '../Timetable';
import ClassBlock from './classBlock/ClassBlock';
import './Weekday.scss'

interface Prop{
    classBlocks:ClassDataDTO[];
}
export interface BlockMetadata{
    posX?:number;
    posY:number;
    height:number;
    width?:number;
}
interface WeekdayConfig{
    startTime:number;
    endTime:number;
    duration:number;
    maxDisplayHeight:number;
    displayWidth:number;
}
function timelerp(ttConfig:WeekdayConfig, blockStart:number){
    let relativeBlockStartTime =  blockStart-ttConfig.startTime;
    let pos = (relativeBlockStartTime/ttConfig.duration) * ttConfig.maxDisplayHeight;
    return pos;
}
function getTimeInMinutes(time:string){
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
function getBlockHeight(ttConfig:WeekdayConfig, blockStart:number, blockEnd:number){
    return ((blockEnd-blockStart)/ttConfig.duration) * ttConfig.maxDisplayHeight;
}
function calcBlockMetadata(ttConfig:WeekdayConfig, block:ClassDataDTO,
    overlapDict:{
        [key: string]: [number,number, number]
    }):BlockMetadata
    {
    
    let blockStartTimeMM = getTimeInMinutes(block.startTime);
    let blockEndTimeMM = getTimeInMinutes(block.endTime);
    let blockPosY = timelerp(ttConfig, blockStartTimeMM);
    let blockHeight = getBlockHeight(ttConfig, blockStartTimeMM, blockEndTimeMM);
    console.log(overlapDict[block.classId], block)
    let blockWidth = ttConfig.displayWidth*(overlapDict[block.classId][2]/overlapDict[block.classId][0]);
    
    let posXOffset = overlapDict[block.classId][1]/overlapDict[block.classId][0] * ttConfig.displayWidth; 
    console.log({posXOffset})
    return {
        posY:blockPosY,
        height:blockHeight,
        posX: posXOffset,
        width:blockWidth}
}  
function overlap(cb1: ClassDataDTO, cb2:ClassDataDTO):boolean{
    const cb1ts = getTimeInMinutes(cb1.startTime);
    const cb1te = getTimeInMinutes(cb1.endTime);
    const cb2ts = getTimeInMinutes(cb2.startTime);
    const cb2te = getTimeInMinutes(cb2.endTime);
    return (cb2ts >= cb1ts && cb2ts < cb1te) || (cb1ts >= cb2ts && cb1ts < cb2te) 
}
class AdjecencyGraph{
    indexMap: {[key:number]:number};
    order:number[];
    maxOverlap: number[];
    //this.e[vertex] = [1,4,5]
    e: {[key:number]:number[]};
    //starting index of subgraph
    subgraphs: number[][];
    subgraph: number[];
    constructor(){
        this.subgraph = [];
        this.e = {};
        this.order = [];
        this.indexMap = [];
        this.subgraphs = [];
        this.maxOverlap = [];
    }
    recalculateOverlap(data:ClassDataDTO[]){
        this.e = [];
        this.subgraphs = [];
        this.indexMap = [];
        this.maxOverlap = [];
        //init values
        this.order = new Array<number>(data.length).fill(-1);
        let visited = new Array<boolean>(data.length).fill(false);
        
        for(let i = 0;i<data.length;i++){
            this.indexMap[data[i].classId] = i;
            this.e[i] = [];
        }        
        //generate edges
        for(let i = 0; i < data.length; i++){
            for (let j = 0; j < data.length; j++) {
                if(i != j){
                    if(overlap(data[i],data[j])){
                        this.e[i].push(j); 
                    }
                }
            }
        }
        // subgraphs = [[0,1,2],[3],[4,5]]
        // array of node index array

        let selected: number|null; 
        while(visited.includes(false)){
            //get first unvisited node if selected is none;
            let group: number[] = []
            selected = visited.findIndex(e=>!e);
            this.dfs(selected, visited, group, this.order);
            this.subgraphs.push(group);
        }
        for(let i = 0 ; i< this.subgraphs.length; i++){
            for(let j = 0;j<this.subgraphs[i].length;j++){
                this.subgraph[this.subgraphs[i][j]] = i;
            }
        }
        //the clique problem https://en.wikipedia.org/wiki/Clique_problem
        let maxOverlapPerGroup:number[] = [];
        for(let subG of this.subgraphs){
            const maxOverlap = this.findMaximumClique(this.createSubset(this.e, subG));
            maxOverlapPerGroup.push(maxOverlap.length);
            // console.log({subG, maxOverlap});
        }
        this.maxOverlap = maxOverlapPerGroup;
        // console.log({maxOverlapPerGroup});
    }
    dfs(startingNode:number, visited:boolean[], group:number[], order:number[]){
        if(!visited[startingNode]){

            visited[startingNode] = true;            
            group.push(startingNode);
            if(this.e[startingNode]===undefined){return;}
            //pick lowest order possible order among neigbours
            let min = new Array<boolean>(100).fill(false);

            for( let i = 0 ;i < this.e[startingNode].length ; i++){
                if(order[this.e[startingNode][i]]!=-1){
                    min[i]=true;
                }
            }
            if(!min.includes(true))
            {
                order[startingNode] = 0;
            }
            else{
            //find first possible slot
                for(let i =0 ;i<min.length;i++){
                    if(!min[i]){
                        order[startingNode] = i;
                        break;
                    }
                }
            }
            for(let i = 0 ;i < this.e[startingNode].length;i++){
                this.dfs(this.e[startingNode][i], visited,group,order);
            }
        }
    }
    createSubset(graph:{[key:number]:number[]}, subset:number[]):{[key:number]:number[]}{
        let subgraph:{[key:number]:number[]} = {};
        for(let i of subset){
            subgraph[i] = graph[i];
        }
        return subgraph;
    }
    //per subgraph
    findMaximumClique(graph: {[key:number]:number[]}): number[] {
        let maxClique: number[] = [];
      
        function isNeighborOfAll(node: number, clique: number[]): boolean {
          return clique.every(member => graph[node].includes(member));
        }
      
        function backtrack(current: number[], candidates: number[]) {
          if (candidates.length === 0) {
            if (current.length > maxClique.length) {
              maxClique = [...current];
            }
            return;
          }
      
          for (let i = 0; i < candidates.length; i++) {
            const node = candidates[i];
            const newCurrent = [...current, node];
            const newCandidates = candidates
              .slice(i + 1)
              .filter(n => isNeighborOfAll(n, newCurrent));
            backtrack(newCurrent, newCandidates);
          }
        }
        
        // const allVertices = graph.map((_, i) => i);
        const allVertices = Object.keys(graph).map(Number);
        backtrack([], allVertices);
        return maxClique;
      }
}
function generateOverlapData(data:ClassDataDTO[]):{ [key: string]: [number,number,number] }{
    // mapa <string,tuple<number,number>> "asdad":[max_overlap,assignedRow,rowspan]
    let cbOverlap:{ [key: string]: [number,number, number]} = {};

    const adjGraph = new AdjecencyGraph();
    adjGraph.recalculateOverlap(data);


    data.forEach((el)=>{
        let maxOverlap = adjGraph.maxOverlap[adjGraph.subgraph[adjGraph.indexMap[el.classId]]]
        let rowspan = maxOverlap - adjGraph.e[adjGraph.indexMap[el.classId]].length
        rowspan = rowspan==0?1:rowspan;
        // let pos = Math.round(Math.random()*(maxOverlap-1));
        let pos = adjGraph.order[adjGraph.indexMap[el.classId]];
        cbOverlap[el.classId]=[maxOverlap,pos,rowspan]
    })



    return cbOverlap;   
}
function Weekday(prop: Prop){
    const startTime = getTimeInMinutes('8:00');
    const endTime = getTimeInMinutes('20:00');
    const ttConfig:WeekdayConfig = {
        startTime,
        endTime,
        duration: endTime - startTime,
        maxDisplayHeight:700,
        displayWidth:320
    }
    prop.classBlocks.sort(
        (cb1, cb2) => {
        const t1 = getTimeInMinutes(cb1.startTime);
        const t2 = getTimeInMinutes(cb2.startTime);
        return (t1>t2)?1:0;
    })

    const overlapDict = generateOverlapData(prop.classBlocks);

    return <div className='weekday'> 
            {prop.classBlocks.map(cb=>{
                //calculate block metadata
                return <ClassBlock metadata = {calcBlockMetadata(ttConfig, cb, overlapDict)} key={cb.classId} block={cb}/>
            })}
        </div>
}
export default Weekday;
