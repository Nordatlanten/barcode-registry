import './App.scss'

import { Outlet } from 'react-router-dom'
import SideHeader from './components/side-header/SideHeader'

import { ReduxProvider } from './redux/provider'

function App() {


  return (
    <>
      <ReduxProvider>
        <SideHeader />
        <Outlet />
      </ReduxProvider>
    </>
  )
}

export default App
