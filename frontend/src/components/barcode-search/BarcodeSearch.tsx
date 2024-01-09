import './BarcodeSearch.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Product, Category } from '../../types/ProductTypes'
import NewProductForm from '../new-product-form/NewProductForm'
import ProductCard from '../product-card/ProductCard'
import Input from '../input/Input'

import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from '../../redux/store'
import { selectBarcode } from '../../redux/features/newProductSlice'
import { addProductToBasket } from '../../redux/features/basketSlice'
import { hideNewProductForm, showNewProductForm } from '../../redux/features/applicationControlSlice'

const FETCH_WAIT_INTERVAL = 800

function BarcodeSearch() {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [foundProduct, setFoundProduct] = useState<Product | null>()
  const [foundCategories, setFoundCategories] = useState<Category[]>([])
  const [query, setQuery] = useState("")
  const textInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null)


  const dispatch = useDispatch<AppDispatch>()
  const barcode = useAppSelector((state) => state.newProductReducer.value.barcode)
  const displayNewProductForm = useAppSelector((state) => state.applicationControlSlice.value.displayNewProductForm)
  useEffect(() => {

    const getCategories = async () => {
      const result = await axios.get('http://localhost:3000/categories')
      setFoundCategories(result.data)
      console.log(result.data)
    }
    getCategories()
  }, [])

  const findProduct = async (query: string) => {
    const result = await axios.get(`http://localhost:3000/products/${query}`)
    console.log(result)
    return result.data
  }

  const handleChange = async (string: string) => {
    setQuery(string)
    if (string.length === 8 || string.length === 13) {
      clearTimeout(timer)
      setTimer(
        setTimeout(async () => {
          const product = await findProduct(string) as Product
          if (product) {
            setFoundProduct(product)
            dispatch(selectBarcode(string))
            dispatch(addProductToBasket(product))
            dispatch(hideNewProductForm())
            setQuery("")
          }
          else {
            setFoundProduct(null)
            dispatch(showNewProductForm())
            dispatch(selectBarcode(string))
            setQuery("")
          }
        }, FETCH_WAIT_INTERVAL
        )
      )
    }
    if (string.length === 0) {
      clearTimeout(timer)
      dispatch(selectBarcode(""))
      setFoundProduct(null)
      dispatch(hideNewProductForm())
    }
  }

  const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    dispatch(selectBarcode(""))
    setFoundProduct(null);
    dispatch(hideNewProductForm())
    if (textInputRef.current) {
      textInputRef.current.value = ""
      textInputRef.current.focus()
    }
  }


  return (
    <div className='barcode-search'>
      <div className='barcode-search__top-column'>
        <form className='barcode-search__form' ref={formRef}>
          <Input type='text' autoFocus value={query} placeholder='Scanna streckkod' label='Streckkod:' id='barcode' onChange={e => handleChange(e.target.value)} ref={textInputRef} />
          <button className='barcode-search__reset-button' onClick={(e) => { handleReset(e) }}>Rensa</button>
        </form>
      </div>
      <div className="barcode-search__bottom-column">
        {foundProduct &&
          <ProductCard name={foundProduct.name} barcode={foundProduct.barcode} price={foundProduct.price} category={foundProduct.category} subcategory={foundProduct.subcategory} deals={foundProduct.deals} />
        }
        {displayNewProductForm &&
          <>
            <p>Produkt hittades inte...</p>
            <NewProductForm />
          </>
        }
      </div>
    </div>
  )
}

export default BarcodeSearch
