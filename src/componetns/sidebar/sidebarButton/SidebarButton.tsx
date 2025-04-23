import {GiHamburgerMenu} from "react-icons/gi";
import './SidebarButton.scss'

interface SidebarButton {
    onClick?: () => void;
}

export default function SidebarButton({onClick}: SidebarButton) {
    return <>
        <div className="SidebarButton">
            <button onClick={onClick}>
                <GiHamburgerMenu/>
            </button>
        </div>
    </>
}