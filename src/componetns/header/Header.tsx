import './Header.scss'
import SkniLogo from '../../assets/skni.png'

export default function Header() {
    return (
        <div className="header">
            <div className="logo">
                <img src={SkniLogo} alt="Logo SKNI"/>
            </div>
            <div className="content"> Plan UMCS</div>
        </div>
    )
}