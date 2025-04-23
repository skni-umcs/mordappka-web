import { ClassDataDTO } from "../../Timetable";
import { WeekdayConfig } from "../Weekday";

export function overlap(cb1: ClassDataDTO, cb2:ClassDataDTO):boolean{
    const cb1ts = getTimeInMinutes(cb1.startTime);
    const cb1te = getTimeInMinutes(cb1.endTime);
    const cb2ts = getTimeInMinutes(cb2.startTime);
    const cb2te = getTimeInMinutes(cb2.endTime);
    return (cb2ts >= cb1ts && cb2ts < cb1te) || (cb1ts >= cb2ts && cb1ts < cb2te) 
}
export function getTimeInMinutes(time:string){
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
export function timelerp(ttConfig:WeekdayConfig, blockStart:number){
    let relativeBlockStartTime =  blockStart-ttConfig.startTime;
    let pos = (relativeBlockStartTime/ttConfig.duration) * ttConfig.maxDisplayHeight;
    return pos;
}

export function getBlockHeight(ttConfig:WeekdayConfig, blockStart:number, blockEnd:number){
    return ((blockEnd-blockStart)/ttConfig.duration) * ttConfig.maxDisplayHeight;
}