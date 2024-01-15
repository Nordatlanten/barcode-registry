import './NewProductForm.scss'
import { useState } from 'react'
import { Product, Category, Subcategory, Deal, FormData, NewProduct } from '../../types/ProductTypes'
import { postNewProduct } from '../../api/product-crud'
import Input from '../input/Input'
import Select from '../select/Select'

import { useDispatch } from "react-redux"
import { useAppSelector, AppDispatch } from '../../redux/store'
import { resetNewProductState } from '../../redux/features/newProductSlice'
import { hideNewProductForm } from '../../redux/features/applicationControlSlice'

function NewProductForm() {
  const category = useAppSelector((state) => state.newProductReducer.value.category)
  const barcode = useAppSelector((state) => state.newProductReducer.value.barcode)
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)

  const [subcategory, setSubcategory] = useState("")
  const [deals, setDeals] = useState<Deal[]>([])


  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = (e: React.FormEvent, body: NewProduct) => {
    e.preventDefault()
    console.log(body)
    try {
      postNewProduct(body)
      dispatch(resetNewProductState())
      dispatch(hideNewProductForm())
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <form className='new-product-form' onSubmit={(e) => handleSubmit(e, { barcode, name, price, category: category.title, subcategory, deals })}>
      <p>Streckkod: <b>{barcode}</b></p>
      <div className='new-product-form__input-field'>
        <Input type='text' placeholder='Produktnamn' label='Produktnamn:' id='product-name-input' onChange={(e) => setName(e.target.value)} />
        <Input type='number' id='price-input' label='Pris:' placeholder='Pris' onChange={(e) => setPrice(parseInt(e.target.value))} />
        <Input type='typeahead' fetchEndpoint='categories' id='categories-input' label='Kategorier:' placeholder='Kategorier' />
        {category.subcategories && category.subcategories.length > 0 &&
          <Select label='Subkategorier:' id='subcategories-select' data={category.subcategories} onChange={(e) => setSubcategory(e.target.value)} />
        }
        <button type="submit">Lägg till</button>
      </div>
    </form>
  )
}
export default NewProductForm
