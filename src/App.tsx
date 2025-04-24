import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout><Home/> </MainLayout>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
