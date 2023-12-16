import './App.scss'

import { Outlet } from 'react-router-dom'
import SideHeader from './components/side-header/SideHeader'


function App() {


  return (
    <>
      <SideHeader />
      <Outlet />
    </>
  )
}

export default App
