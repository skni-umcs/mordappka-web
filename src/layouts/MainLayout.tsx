import { ReactNode } from "react";

interface Props {
    children: ReactNode
}

function MainLayout({children}:Props){
    return <div>
        {/* <Navbar/> */}
        <main>{children}</main>
        {/*<Footer/>*/}
    </div>
}
export default MainLayout;