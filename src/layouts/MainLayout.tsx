import {ReactNode} from "react";
import Footer from '../componetns/footer/Footer';
import Header from '../componetns/header/Header';
import Sidebar from '../componetns/sidebar/Sidebar';
import './MainLayout.scss';

interface Props {
    children: ReactNode
}

function MainLayout({children}: Props) {
    return <div className="layout">
        <Sidebar />
        <div className="content">
            <Header/>
            <main>{children}</main>
            <Footer/>
        </div>
    </div>
}
export default MainLayout;