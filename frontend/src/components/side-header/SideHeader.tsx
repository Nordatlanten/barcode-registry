import './SideHeader.scss'
import { Link } from 'react-router-dom'

function SideHeader() {
  return (
    <header className='side-header'>
      <p><b>Barcode Registry</b></p>
      <nav className='side-header__nav'>
        <ul>
          <li><Link to={`/`}>Skanna streckkod</Link></li>
          <li><Link to={`/add-deals`}>Lägg till erbjudanden</Link></li>
          <li><Link to={`/add-categories`}>Lägg till kategorier</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default SideHeader
