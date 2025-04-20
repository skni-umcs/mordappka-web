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
}
interface WeekdayConfig{
    startTime:number;
    endTime:number;
    duration:number;
    maxDisplayHeight:number;
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
function calcBlockMetadata(ttConfig:WeekdayConfig, block:ClassDataDTO)
    :BlockMetadata{
    let blockStartTimeMM = getTimeInMinutes(block.startTime);
    let blockEndTimeMM = getTimeInMinutes(block.endTime);
    let blockPosY = timelerp(ttConfig, blockStartTimeMM);
    let blockHeight = getBlockHeight(ttConfig, blockStartTimeMM, blockEndTimeMM);
    return {posY:blockPosY,height:blockHeight}
}
function Weekday(prop: Prop){
    const startTime = getTimeInMinutes('8:00');
    const endTime = getTimeInMinutes('20:00');
    const ttConfig:WeekdayConfig = {
        startTime,
        endTime,
        duration: endTime - startTime,
        maxDisplayHeight:700
    }
    return <div className='weekday'>
            {prop.classBlocks.map(cb=>{
                //calculate block metadata
 
                return <ClassBlock metadata = {calcBlockMetadata(ttConfig, cb)} key={cb.classId} block={cb}/>
            })}
        </div>
}
export default Weekday;
