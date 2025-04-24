// import ClassFinder from '../componetns/classExplorer/ClassFinder';
import Timetable from '../componetns/timetable/Timetable';
import './Home.scss'
export default function Home(){
    return (
        <>
        <div className='home'>
            <Timetable/>
            {/* <ClassFinder/> */}
        </div>
        </>
    )
}