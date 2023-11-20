
import './App.scss'

import Page from './components/page/Page'
import BarcodeSearch from './components/barcode-search/BarcodeSearch'
import SideHeader from './components/side-header/SideHeader'


function App() {


  return (
    <>
      <SideHeader />
      <Page title="Sök streckkod">
        <BarcodeSearch />
      </Page>
    </>
  )
}

export default App
