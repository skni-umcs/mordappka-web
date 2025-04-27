import {useState} from "react";
import './Sidebar.scss'
import SidebarButton from "./sidebarButton/SidebarButton.tsx";
import Logo from "../logo/Logo.tsx";
import Menu from "./menu/Menu.tsx";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    return <>
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <Logo />
            <SidebarButton onClick={() => setIsOpen(prev => !prev)}/>
            {/*Tu trzeba wrzucić szukajkę*/}
            <Menu isOpen = {isOpen} />
        </div>
    </>

}