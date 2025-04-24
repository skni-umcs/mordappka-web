import { ClassDataDTO } from '../../Timetable';
import { BlockMetadata } from '../Weekday';
import './ClassBlock.scss'

interface Prop{
    block:ClassDataDTO;
    metadata:BlockMetadata;
}

function ClassBlock(prop:Prop){
    return <div
    className='classBlock'
    style={{
        top: `${prop.metadata.posY}px`,
        left: `${prop.metadata.posX || 0}px`,
        height: `${prop.metadata.height}px`,
        width: `${prop.metadata.width}px`
      }}
    >
        <p>{prop.block.subjectName}</p>
        <p>{prop.block.startTime} - {prop.block.endTime}</p>
    </div>
}
export default ClassBlock;
