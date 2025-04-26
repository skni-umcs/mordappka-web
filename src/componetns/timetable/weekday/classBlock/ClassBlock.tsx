import { useState } from 'react';
import { ClassDataDTO } from '../../Timetable';
import { BlockMetadata } from '../Weekday';
import './ClassBlock.scss'

interface Prop{
    block:ClassDataDTO;
    metadata:BlockMetadata;
}

function ClassBlock(prop:Prop){
    const { posX , posY, height, width } = prop.metadata;
    const [hovered, setHovered] = useState(false);

    return <div
    style={{
      position: 'absolute',
      top: `${posY}px`,
      left: hovered ? '0px' : `${posX}px`,
      height: hovered && height<130 ? '130px':`${height}px`,
      width: hovered ? '100%' : `${width}%`,
      transition: 'all 0.3s ease',
      zIndex: hovered ? 10 : 1, // opcjonalnie na hover
    }}
    className="classBlock"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
        <p>{prop.block.subjectName}</p>
        <p>{prop.block.startTime} - {prop.block.endTime}</p>
    </div>
}
export default ClassBlock;
