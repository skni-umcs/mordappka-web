import {useState} from "react";
import './Sidebar.scss'
import SidebarButton from "./sidebarButton/SidebarButton.tsx";
import SidebarBox from "./sidebarBox/SidebarBox.tsx";
import { MdTripOrigin } from "react-icons/md";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    return <>
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>

            <SidebarButton onClick={() => setIsOpen(prev => !prev)}/>
            <SidebarBox displayText={"Strona główna"} refLink={"https://umcs.pl"} Icon={MdTripOrigin} extended={isOpen}/>
            <SidebarBox displayText={"O SKNI"} refLink={"https://skni.umcs.pl/"} Icon={MdTripOrigin} extended={isOpen}/>
            <SidebarBox displayText={"Wydziały"} refLink={"https://umcs.pl"} Icon={MdTripOrigin} extended={isOpen}/>
            <SidebarBox displayText={"Lista sal"} refLink={"https://umcs.pl"} Icon={MdTripOrigin} extended={isOpen}/>
            <SidebarBox displayText={"Załóż konto"} refLink={"https://umcs.pl"} Icon={MdTripOrigin} extended={isOpen}/>
        </div>
    </>

}