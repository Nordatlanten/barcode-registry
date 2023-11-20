import './NewProductForm.scss'
import { useState } from 'react'
import { Product, Category, Subcategory, Deal } from '../../types/ProductTypes'
import { postNewProduct } from '../../api/product-crud'

type NewProductFormProps = {
  barcode: string
}

function NewProductForm(props: NewProductFormProps) {
  const barcode = props.barcode
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  return (
    <form className='new-product-form' onSubmit={(e) => postNewProduct(e, { barcode, name, price, categories, subcategories, deals })}>
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
          <input onChange={(e) => setCategories([{ title: e.target.value }])} type="text" />
        </label>
        <label>
          <span>Subkategori: </span>
          <input onChange={(e) => setSubcategories([{ title: e.target.value }])} type="text" />
        </label>
        <button type="submit">Lägg till</button>
      </div>
    </form>
  )
}
export default NewProductForm
