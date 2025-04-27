import { BlockMetadata, ClassData, ClassDataDTO } from "../../Timetable";
import { WeekdayConfig } from "../Weekday";
import { CollisionGraph } from "./graph";

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
export function generateOverlapData(ttConfig: WeekdayConfig, data: ClassData[]): {[key: number]: BlockMetadata} {
    let cbOverlap: { [key: string]: [number, number, number] } = {};
    const colGraph = new CollisionGraph(data);
    data.forEach((block) => {
      let maxOverlap = colGraph.getMaxOverlap(block.cbDTO.classId);
      let rowspan = colGraph.getRowspan(block.cbDTO.classId);
      rowspan = rowspan == 0 ? 1 : rowspan;
      let pos = colGraph.getBlockRowPosition(block.cbDTO.classId);
      cbOverlap[block.cbDTO.classId] = [maxOverlap, pos, rowspan];
    });
    let d: { [key: number]: BlockMetadata } = {};
  
    for (let block of data) {
      let blockStartTimeMM = getTimeInMinutes(block.cbDTO.startTime);
      let blockEndTimeMM = getTimeInMinutes(block.cbDTO.endTime);
      let blockPosY = timelerp(ttConfig, blockStartTimeMM);
      let blockHeight = getBlockHeight(
        ttConfig,
        blockStartTimeMM,
        blockEndTimeMM
      );
  
      let blockWidth = (cbOverlap[block.cbDTO.classId][2] / cbOverlap[block.cbDTO.classId][0]) * 100.0;
      let posXOffset =
        (cbOverlap[block.cbDTO.classId][1] / cbOverlap[block.cbDTO.classId][0]) *
        ttConfig.displayWidth;
  
      block.properties={
        posY: blockPosY,
        height: blockHeight,
        posX: posXOffset,
        width: blockWidth,
      };
      if(!block.visible){
        block.properties={
            posY: 0,
            height: 0,
            posX: 0,
            width: 0,
          };
      }
    }
    return d;
  }