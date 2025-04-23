import {useState} from "react";
import './Sidebar.scss'
import SidebarButton from "./sidebarButton/SidebarButton.tsx";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    return <>
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>

            <SidebarButton onClick={() => setIsOpen(prev => !prev)}/>
            {isOpen && (
                <ul>
                    <li>Strona główna</li>
                    <li>Profil</li>
                    <li>Ustawienia</li>
                </ul>
            )}
        </div>
    </>

}