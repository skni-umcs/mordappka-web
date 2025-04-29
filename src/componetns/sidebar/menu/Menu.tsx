import SidebarBox from "./../sidebarBox/SidebarBox.tsx";
import { MdHome, MdInfo, MdSchool, MdMeetingRoom, MdPersonAdd } from "react-icons/md";

interface Props {
    isOpen: boolean;
}

export default function Menu({ isOpen } : Props) {
    return <div className="menu">
        <SidebarBox displayText={"Strona główna"} refLink={"https://umcs.pl"} Icon={MdHome} extended={isOpen}/>
        <SidebarBox displayText={"Wydziały"} refLink={"https://umcs.pl"} Icon={MdSchool} extended={isOpen}/>
        <SidebarBox displayText={"Lista sal"} refLink={"https://umcs.pl"} Icon={MdMeetingRoom} extended={isOpen}/>
        <SidebarBox displayText={"Załóż konto"} refLink={"https://umcs.pl"} Icon={MdPersonAdd} extended={isOpen}/>
        <SidebarBox displayText={"O SKNI"} refLink={"https://skni.umcs.pl/"} Icon={MdInfo} extended={isOpen}/>
    </div>
}
