import './SideHeader.scss'

function SideHeader() {
  return (
    <header className='side-header'>
      <p><b>Barcode Registry</b></p>
      <nav className='side-header__nav'>
        <div>
          <a>Skanna streckkod</a>
        </div>
        <div>
          <a>Lägg till erbjudanden (N/A)</a>
        </div>
        <div>
          <a>Lägg till kategorier (N/A)</a>
        </div>
      </nav>
    </header>
  )
}

export default SideHeader
