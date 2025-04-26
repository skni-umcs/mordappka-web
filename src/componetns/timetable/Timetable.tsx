import { useEffect, useState } from 'react';
import './Timetable.scss'
import axios from 'axios';
import Weekday, { WeekdayConfig } from './weekday/Weekday';
import { generateOverlapData, getTimeInMinutes } from './weekday/util/util';

//to trzeba przenieść w jakieś odpowiednie miejsce
export interface ClassDataDTO{
    classId: number;
    classType: string;
    subjectName: string;
    teacherName: string;
    startTime: string;
    endTime: string;
    weekday: number;
    roomNumber: string;
    teacherId: number;
    roomId: number;
    group: string;
}
//additional attached properties
export interface ClassData{
    cbDTO: ClassDataDTO;
    properties: BlockMetadata;
    visible:boolean;
}
export interface BlockMetadata {
    posX?: number;
    posY: number;
    height: number;
    width?: number;
}

function Timetable(){
    const [timetable, setTimetable] = useState<ClassData[][]>([[],[],[],[],[],[],[]]);

    const updateVisibility = (block: ClassDataDTO, visible_: boolean) => {
        setTimetable(prevTimetable => 
            {
                prevTimetable.forEach
                ((e) => {generateOverlapData(ttConfig, e.filter(cb=>cb.visible))});
                prevTimetable = prevTimetable.map((dayBlocks) => dayBlocks.map(block => 
                    block.cbDTO.classId === block.cbDTO.classId 
                      ? { ...block, visible: !block.visible }: block))
                return prevTimetable;
            });
      };
      const weekDayNames = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela']
      const startTime = getTimeInMinutes("8:00");
      const endTime = getTimeInMinutes("20:00");
      // console.log(prop);
      const ttConfig: WeekdayConfig = {
        startTime,
        endTime,
        duration: endTime - startTime,
        maxDisplayHeight: 700,
        displayWidth: 320,
      };
        
      

    // (?????) zrobić serwis do zarządzania danymi timetable (?????)
    useEffect(()=>{
        axios.get<ClassDataDTO[]>("/api/classes/year?id=842") //temporary URL
        .then((response)=>{
            let timetableData:ClassData[] = response.data.map(cb => { return {
                cbDTO:cb,
                visible:true,
                properties:{
                    posX:0,
                    posY:0,
                    height:0,
                }
            }
            })
            timetableData.sort((cb1, cb2) => {
                const t1 = getTimeInMinutes(cb1.cbDTO.startTime);
                const t2 = getTimeInMinutes(cb2.cbDTO.startTime);
                return t1 > t2 ? 1 : 0;
              });
            
            const days = [1,2,3,4,5,6,7];
            let timeTableDataDaily:ClassData[][] = days
                .map(day => timetableData
                    .filter(cb=>cb.cbDTO.weekday == day));
            timeTableDataDaily.forEach(
                (e) => {generateOverlapData(ttConfig, e.filter(cb=>cb.visible))});
            setTimetable(timeTableDataDaily);
        }).catch((error)=>{
            console.error("Error while fetching data. " + error);
        })
    },[])

    

    return <div className="timetable">
        {timetable.map((day, i)=>
        <Weekday key={i} classBlocks={day} weekday={weekDayNames[i]} onVisibilityChange={updateVisibility}/>)
        }
    </div>
}
export default Timetable;