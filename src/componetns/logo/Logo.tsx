import './Logo.scss'
import SkniLogo from '../../assets/skni.png'

export default function Logo() {
    return (
        <div className="logo">
            <img src={SkniLogo} alt="Logo SKNI"/>
        </div>
    )
}