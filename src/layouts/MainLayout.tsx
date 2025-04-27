import {ReactNode} from "react";
import Footer from '../componetns/footer/Footer';
import Sidebar from '../componetns/sidebar/Sidebar';
import './MainLayout.scss';

interface Props {
    children: ReactNode
}

function MainLayout({children}: Props) {
    return <div className="layout">
        <Sidebar />
        <div className="content">
            <main>{children}</main>
            <Footer/>
        </div>
    </div>
}
export default MainLayout;