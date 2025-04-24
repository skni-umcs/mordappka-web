import {ComponentType} from "react";
import './SidebarBox.scss'

interface SidebarBox {
    displayText: string;
    refLink: string;
    Icon: ComponentType;
    extended: boolean;
}

export default function SidebarBox({displayText, refLink, Icon, extended}: SidebarBox) {
    return <div className={`sidebar-box ${extended ? 'open' : 'closed'}`}>
        <div className="icon">
            <Icon />
        </div>
        <div className="content">
            <a href={refLink} target="_blank" rel="noopener noreferrer">{displayText}</a>
        </div>
    </div>
}