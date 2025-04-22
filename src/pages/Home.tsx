import ClassFinder from '../componetns/classExplorer/ClassFinder';
import Timetable from '../componetns/timetable/Timetable';
import Footer from '../componetns/footer/Footer';
import Header from '../componetns/header/Header'
import './Home.scss'
export default function Home(){
    return (
        <>
        <Header/>
        <div className='home'>
            <Timetable/>
            {/* <ClassFinder/> */}
        </div>
        <Footer/>
        </>
    )
}