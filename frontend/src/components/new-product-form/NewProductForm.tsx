import './NewProductForm.scss'
import { useState } from 'react'
import { Product, Category, Subcategory, Deal, FormData } from '../../types/ProductTypes'
import { postNewProduct } from '../../api/product-crud'
import Input from '../input/Input'

type NewProductFormProps = {
  barcode: string
}



function NewProductForm(props: NewProductFormProps) {
  const barcode = props.barcode
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [deals, setDeals] = useState<Deal[]>([])
  return (
    <form className='new-product-form' onSubmit={(e) => postNewProduct(e, { barcode, name, price, category, subcategory, deals })}>
      <div>
        <p>Streckkod: {props.barcode}</p>
        <label>
          <span>Produktnamn: </span>
          <input onChange={(e) => setName(e.target.value)} type="text" />
        </label>
        <label>
          <span>Pris: </span>
          <input onChange={(e) => setPrice(parseInt(e.target.value))} type="number" />
        </label>
        <label>
          <span>Kategori: </span>
          <input onChange={(e) => setCategory(e.target.value)} type="text" />
        </label>
        <label>
          <span>Subkategori: </span>
          <input onChange={(e) => setSubcategory(e.target.value)} type="text" />
        </label>
        <button type="submit">Lägg till</button>
      </div>
    </form>
  )
}
export default NewProductForm
