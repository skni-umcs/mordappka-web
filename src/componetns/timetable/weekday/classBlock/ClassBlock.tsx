import { useState } from 'react';
import { ClassData } from '../../Timetable';
import './ClassBlock.scss'

interface Prop{
    block:ClassData;
    onVisibilityChange: (block: number, visible: boolean) => void;
}

function ClassBlock(prop:Prop){
    const { posX , posY, height, width } = prop.block.properties;
    const [hovered, setHovered] = useState(false);
    // const [prop, setBlockVisible] = useState(true);
    // console.log(prop.block);
    const stimeparts = prop.block.cbDTO.startTime.split(':');
    const etimeparts = prop.block.cbDTO.endTime.split(':'); 
    const timeformmated = stimeparts[0]+":"+stimeparts[1] + "-"+etimeparts[0]+":"+etimeparts[1];
    return <div
    hidden={!prop.block.visible}
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
        <p className='room'>{prop.block.cbDTO.roomNumber.split(' ').filter((_, i)=>i<2).join('')}
        {hovered && (
          <input
            type="checkbox"
            checked={prop.block.visible}
            onChange={(e) => prop.onVisibilityChange(prop.block.cbDTO.classId, e.target.checked)}
          />)}          🕗{timeformmated}</p>
        <p>{prop.block.cbDTO.subjectName}</p>
        <p>{prop.block.cbDTO.teacherName}</p>
        <p></p>

    </div>
}
export default ClassBlock;
