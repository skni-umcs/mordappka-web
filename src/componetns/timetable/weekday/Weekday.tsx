import { ClassDataDTO } from '../Timetable';
import ClassBlock from './classBlock/ClassBlock';
import './Weekday.scss'

interface Prop{
    classBlocks:ClassDataDTO[];
}
export interface BlockMetadata{
    //vertical offset needed when overlapping blocks are introduced
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
// TODO: overlapping blocks
function calcBlockMetadata(ttConfig:WeekdayConfig, block:ClassDataDTO, overlapDict:{
    [key: string]: [number,number]
})
    :BlockMetadata{
    let blockStartTimeMM = getTimeInMinutes(block.startTime);
    let blockEndTimeMM = getTimeInMinutes(block.endTime);
    let blockPosY = timelerp(ttConfig, blockStartTimeMM);
    let blockHeight = getBlockHeight(ttConfig, blockStartTimeMM, blockEndTimeMM);
    let blockWidth = ttConfig.displayWidth/(overlapDict[block.classId][0]+1);
    let posXOffset = overlapDict[block.classId][1]==-1? 0 : overlapDict[block.classId][1]*blockWidth; 
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
function generateOverlapData(data:ClassDataDTO[]):any{
    // mapa <string,tuple<number,number>> "asdad":[max_overlap,assignedRow]
    let cbOverlap:{ [key: string]: [number,number] } = {};

    data.forEach((el)=>{cbOverlap[el.classId]=[0,-1]})
    data.sort(
        (cb1, cb2) => {
        const t1 = getTimeInMinutes(cb1.startTime);
        const t2 = getTimeInMinutes(cb2.startTime);
        return (t1>t2)?1:0;
    })
    for (let i = 0 ; i<data.length-1;i++){
        let j = 0;
        while(overlap(data[i],data[i+j+1])){
            const cb1Ind = data[i].classId;
            const cb2Ind = data[i+ j + 1].classId; 
            cbOverlap[cb1Ind][0]++;
            cbOverlap[cb2Ind][0]++;

            if(cbOverlap[cb1Ind][1] == -1 && cbOverlap[cb2Ind][1] == -1){
                cbOverlap[cb1Ind][1] = 0;
                cbOverlap[cb2Ind][1] = 1
            }
            else{
                if(cbOverlap[cb1Ind][1] == -1){
                    cbOverlap[cb1Ind][1] = cbOverlap[cb2Ind][1] + 1;
                }
                else{
                    cbOverlap[cb2Ind][1] = cbOverlap[cb1Ind][1] + 1;

                }
            }

            j++;
        }
    }
    console.log(cbOverlap);
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
        displayWidth:200
    }

    const overlapDict = generateOverlapData(prop.classBlocks);

    return <div className='weekday'> 
            {prop.classBlocks.map(cb=>{
                //calculate block metadata
                return <ClassBlock metadata = {calcBlockMetadata(ttConfig, cb, overlapDict)} key={cb.classId} block={cb}/>
            })}
        </div>
}
export default Weekday;
