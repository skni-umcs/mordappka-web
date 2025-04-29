import { useEffect, useState } from 'react';
import './Timetable.scss'
import axios from 'axios';
import Weekday, { WeekdayConfig } from './weekday/Weekday';
import { generateOverlapData, getTimeInMinutes, timelerp } from './weekday/util/util';

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

    const updateVisibility = (blockId: number, visible_: boolean) => {
        setTimetable(prevTimetable => 
            {
                
                prevTimetable = prevTimetable.map((dayBlocks) => dayBlocks.map(block => 
                    block.cbDTO.classId === blockId 
                      ? { ...block, visible: visible_ }: block));
                prevTimetable.forEach
                ((e) => {generateOverlapData(ttConfig, e.filter(cb=>cb.visible))});
                return prevTimetable;
            });
        console.log(timetable);
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

    const times=['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

    return <div className="timetable">
        <h1>Informatyka 2 rok st. II 2024/2025 Zima</h1>
        <div className="hour-lines">
            {times.map((t) => (
                <div key={t} className="hour-line" style={{ left:'40px',top: `${timelerp(ttConfig, getTimeInMinutes(t))+75}px` }} />
            ))}
        </div>
        <div className="hour-lines">
            {times.map((t) => (
                <div key={t} className='hour' style={{ top: `${timelerp(ttConfig, getTimeInMinutes(t))+63}px` }} > {t}</div>
            ))}
        </div>
        <div className='weekdays'>
        {
        timetable.map((day, i)=>{
            if(i<5){
            return (
                <Weekday key={i} classBlocks={day} weekday={weekDayNames[i]} onVisibilityChange={updateVisibility}/>
            )}})
        }
        </div>
    </div>
}
export default Timetable;