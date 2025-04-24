import { ClassDataDTO } from "../../Timetable";
import { overlap } from "./util";

type Graph = {
    [key:number]:number[];
}

export class CollisionGraph{
    private indexMap: {[key:number]:number};
    private order:number[];
    private maxOverlap: number[];
    private edges: Graph;
    private groups: number[][];
    private groupId: number[];
    constructor(data:ClassDataDTO[]){
        //Groups - podzbiory zawierające spójne grafy (pojedyńczy niepołączony wierzchołek jest spójny)
        this.groupId = [];
        this.groups = [];

        this.edges = {};
        this.indexMap = [];
        this.maxOverlap = [];
        this.order = new Array<number>(data.length).fill(-1);
        let visited = new Array<boolean>(data.length).fill(false);
        
        for(let i = 0;i<data.length;i++){
            this.indexMap[data[i].classId] = i;
            this.edges[i] = [];
        }        
        //generate edges
        for(let i = 0; i < data.length; i++){
            for (let j = 0; j < data.length; j++) {
                if(i != j){
                    if(overlap(data[i],data[j])){
                        this.edges[i].push(j); 
                    }
                }
            }
        }
        let selected: number|null; 

        //Wyodrębnianie spójnych podzbiorów
        while(visited.includes(false)){
            //get first unvisited node if selected is none;
            let group: number[] = []
            selected = visited.findIndex(edges=>!edges);
            this.dfs(selected, visited, group);
            this.groups.push(group);
        }
        for(let i = 0 ; i< this.groups.length; i++){
            for(let j = 0;j<this.groups[i].length;j++){
                this.groupId[this.groups[i][j]] = i;
            }
        }
        //the clique problem https://en.wikipedia.org/wiki/Clique_problem
        let maxOverlapPerGroup:number[] = [];
        for(let subG of this.groups){
            const maxOverlap = this.findMaximumClique(this.createSubset(this.edges, subG));
            maxOverlapPerGroup.push(maxOverlap.length);
        }
        this.maxOverlap = maxOverlapPerGroup;
    }
    getBlockRowPosition(classBlockId: number){
        let internalIndex = this.indexMap[classBlockId];
        return this.order[internalIndex];
    }
    getMaxOverlap(classBlockId: number){
        let internalIndex = this.indexMap[classBlockId];
        let groupId = this.groupId[internalIndex];
        return this.maxOverlap[groupId];
    }
    getRowspan(classBlockId: number){
        let internalIndex = this.indexMap[classBlockId];
        let groupId = this.groupId[internalIndex];

        return this.maxOverlap[groupId] - this.edges[internalIndex].length; 
    }
    private dfs(startingNode:number, visited:boolean[], group:number[]){
        if(!visited[startingNode]){

            visited[startingNode] = true;            
            group.push(startingNode);
            //if no neighbours its undefinded
            if(this.edges[startingNode]===undefined){return;}
            //pick lowest order possible order among neigbhours
            let min = new Array<boolean>(15).fill(false);
            let numNeighbours = this.edges[startingNode].length

            for( let i = 0 ;i < numNeighbours ; i++){
                const neigbour = this.edges[startingNode][i];
                const neigbourOrder = this.order[neigbour]
                if(neigbourOrder!=-1){
                    min[neigbourOrder]=true;
                }
            }
            if(!min.includes(true))
            {
                this.order[startingNode] = 0;
            }
            else{
            //find first possible slot
                for(let i =0 ;i<min.length;i++){
                    if(!min[i]){
                        this.order[startingNode] = i;
                        break;
                    }
                }
            }
            for(let i = 0; i < numNeighbours; i++){
                this.dfs(this.edges[startingNode][i], visited, group);
            }
        }
    }
    private createSubset(graph:Graph, subset:number[]):Graph{
        let groupId:{[key:number]:number[]} = {};
        for(let i of subset){
            groupId[i] = graph[i];
        }
        return groupId;
    }
    //per group
    private findMaximumClique(graph: Graph): number[] {
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
        
        const allVertices = Object.keys(graph).map(Number);
        backtrack([], allVertices);
        return maxClique;
      }
}