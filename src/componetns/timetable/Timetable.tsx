import { useEffect, useState } from 'react';
import './Timetable.scss'
import Weekday from './weekday/Weekday';
import axios from 'axios';

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

function Timetable(){

    const [timetable, setTimetable] = useState<ClassDataDTO[]>([]);

    // (?????) zrobić serwis do zarządzania danymi timetable (?????)
    // useEffect(()=>{
    //     axios.get<ClassDataDTO[]>("/api/classes/year?id=15") //temporary URL
    //     .then((response)=>{
    //         setTimetable(response.data);
    //     }).catch((error)=>{
    //         console.error("Error while fetching data. " + error);
    //     })
    // },[])
    useEffect(()=>{
        setTimetable([
            {
                classId: 11,
                classType: "Wykład",
                subjectName: "Układy mikroporcesorowe",
                teacherName: "Andrzej Kowalski",
                startTime: "8:45",
                endTime: "10:00",
                weekday: 1,
                roomNumber: "C453",
                teacherId: 32,
                roomId: 34,
                group: "1/1"
            },{
            classId: 1,
            classType: "Wykład",
            subjectName: "Układy mikroporcesorowe",
            teacherName: "Andrzej Kowalski",
            startTime: "8:00",
            endTime: "12:00",
            weekday: 1,
            roomNumber: "C453",
            teacherId: 32,
            roomId: 34,
            group: "1/1"
        },{
            classId: 2,
            classType: "Laby",
            subjectName: "Inżynieria Oprogramowania",
            teacherName: "Andrzej Kowalski",
            startTime: "12:30",
            endTime: "14:25",
            weekday: 1,
            roomNumber: "C453",
            teacherId: 32,
            roomId: 34,
            group: "1/1"
        },
        {
            classId: 223,
            classType: "Laby",
            subjectName: "ASYKO<3",
            teacherName: "Andrzej Kowalski",
            startTime: "11:00",
            endTime: "12:00",
            weekday: 1,
            roomNumber: "C453",
            teacherId: 32,
            roomId: 34,
            group: "1/1"
        }
    ]);
    },[])
    

    return <div className="timetable">
        {/* TODO trzeba tak przefiltrować, żeby każdy weekday dostawał swój subset zajęć */}
        {/* {timetable.map( (tt) => (<Weekday key={tt.classId} classBlocks={tt} />))} */}
        <Weekday classBlocks={timetable}/>
    </div>
}
export default Timetable;