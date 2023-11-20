import './BarcodeSearch.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { Product, Category, Subcategory, Deal } from '../../types/ProductTypes'
import NewProductForm from '../new-product-form/NewProductForm'
import ProductCard from '../product-card/ProductCard'
const FETCH_WAIT_INTERVAL = 500

function BarcodeSearch() {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [barcode, setBarcode] = useState("")
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [foundProduct, setFoundProduct] = useState<Product | null>()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [foundCategories, setFoundCategories] = useState<Category[]>([])


  const textInputRef = useRef<HTMLInputElement>(null);

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
    setBarcode(string)
    if (string.length === 8 || string.length === 13) {
      clearTimeout(timer)
      setTimer(
        setTimeout(async () => {
          const product = await findProduct(string) as Product
          if (product) {
            setFoundProduct(product)
          }
          else {
            setFoundProduct(null)
            setShowNewProductForm(true)
          }
        }, FETCH_WAIT_INTERVAL
        )
      )
    }
    if (string.length === 0) {
      clearTimeout(timer)
      setBarcode("")
      setFoundProduct(null)
      setShowNewProductForm(false)
    }
  }

  // const postNewProduct = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const body = {
  //     name,
  //     price: parseInt(price),
  //     barcode,
  //     categories
  //   }
  //   const result = await axios.post('http://localhost:3000/product', body, {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   setName("")
  //   setPrice("")
  //   setBarcode("")
  //   setCategories([])
  //   setSelectedCategory("")
  //   setShowNewProductForm(false)
  //   if (textInputRef.current) textInputRef.current.focus()
  //   console.log(result)
  // }


  return (
    <div className='barcode-search'>
      <div className='barcode-search__left-column'>
        <input ref={textInputRef} autoFocus value={barcode} onChange={e => handleChange(e.target.value)} />
        <button onClick={() => { setBarcode(""); setFoundProduct(null); if (textInputRef.current) textInputRef.current.focus() }}>Rensa</button>
      </div>
      <div className="barcode-search__right-column">
        {foundProduct &&
          <ProductCard name={foundProduct.name} barcode={foundProduct.barcode} price={foundProduct.price} categories={foundProduct.categories} subcategories={foundProduct.subcategories} deals={foundProduct.deals} />
        }
        {showNewProductForm &&
          <>
            <p>Produkt hittades inte...</p>
            <p>Lägg till ny produkt:</p>
            <NewProductForm barcode={barcode} />
          </>
        }
      </div>
    </div>
  )
}

export default BarcodeSearch
