import { useEffect, useState } from 'react';
import './Timetable.scss'
import Weekday from './weekday/Weekday';
import axios from 'axios';

//to trzeba przenieść w jakieś odpowiednie miejsce
interface ClassDataDTO{
    classId: number;
    classType: string;
    subjectName: string;
    teacherName: string;
    startTime: string;
    endTime: string;
    weekday: string;
    roomNumber: string;
    teacherId: number;
    roomId: number;
    group: string;

}

function Timetable(){

    const [timetable, setTimetable] = useState<ClassDataDTO[]>([]);

    // (?????) zrobić serwis do zarządzania danymi timetable (?????)
    useEffect(()=>{
        axios.get<ClassDataDTO[]>("/api/classes/year?id=15") //temporary URL
        .then((response)=>{
            setTimetable(response.data);
        }).catch((error)=>{
            console.error("Error while fetching data. " + error);
        })
    },[])
    

    return <div className="timetable">
        {/* TODO trzeba tak przefiltrować, żeby każdy weekday dostawał swój subset zajęć */}
        {timetable.map( (tt) => (<Weekday key={tt.classId} day={tt.subjectName} />))}
    </div>
}
export default Timetable;