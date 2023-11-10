import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.scss'

interface Product {
  name: string,
  barcode: string,
  price: number,
  categories: Category[],
  deals: Deal[]
}

interface Category {
  title: string,
  subcategories: Subcategory[]
}

interface Subcategory {
  title: string
}

interface Deal {
  description: string,
  amount: number,
  total: number
}

const FETCH_WAIT_INTERVAL = 500

function App() {
  const [timer, setTimer] = useState<NodeJS.Timeout>()
  const [barcode, setBarcode] = useState("")
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [foundProduct, setFoundProduct] = useState<Product | null>()
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  // const [subCategories, setSubCategories] = useState<Subcategory[]>([])
  // const [deals, setDeals] = useState<Deal[]>([])
  const [foundCategories, setFoundCategories] = useState<Category[]>([])

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
    console.log(string.length)
    if (string.length === 8 || string.length === 13) {
      setBarcode(string)
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

  const postNewProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      name,
      price: parseInt(price),
      barcode,
      categories
    }
    const result = await axios.post('http://localhost:3000/product', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(result)
  }


  return (
    <>
      <h1>Barcode Registry</h1>
      <div className='app-content'>
        <div className='app-content__left-column'>
          <p>barcode: {barcode}</p>
          <input onChange={e => handleChange(e.target.value)} />
        </div>
        <div className="app-content__right-column">
          {foundProduct &&
            <div className='app-content__product'>
              <h2>{foundProduct.name}</h2>
              <p>Pris: {foundProduct.price}</p>
              {foundProduct.categories.length > 0 &&
                <>
                  <p>Kategorier:</p>
                  <ol className='app-content__categories'>
                    {foundProduct.categories.map((category, i) =>
                      <li>
                        {category.title}
                        {category.subcategories.length > 0 &&
                          <>
                            <p>Subkategorier:</p>
                            <ol className='app-content__subcategories'>
                              {category.subcategories.map((subcategory, i) =>
                                <li>
                                  {subcategory.title}
                                </li>
                              )}
                            </ol>
                          </>
                        }
                      </li>
                    )}
                  </ol>

                </>
              }
              {foundProduct.deals.length > 0 &&
                <ul>
                  {foundProduct.deals.map((deal, i) =>
                    <li>
                      Deal {i}: {deal.description}
                      <br />
                      {deal.amount} för {deal.total}
                    </li>)}
                </ul>}
            </div>

          }
          {showNewProductForm &&
            <form className='app-content__form' onSubmit={(e) => postNewProduct(e)}>
              <div className='app-content__form-content'>
                <div className='app-content__form-left'>
                  <p>Streckkod: {barcode}</p>
                  <label>
                    <span>produktnamn</span>
                    <input type="text" onChange={e => setName(e.target.value)} />
                    <p>(valt namn: {name})</p>
                  </label>
                  <label>
                    <span>price in sek</span>
                    <input type="number" onChange={e => setPrice(e.target.value)} />
                    <p>(valt pris: {price})</p>
                  </label>
                </div>
                <div className='app-content__form-right'>
                  <h2>Lägg till kategori?</h2>
                  {foundCategories && <select onChange={(e) => {
                    setCategories([...categories, { title: e.target.value, subcategories: [] }])
                    console.log(categories)
                  }
                  }>
                    <option>--- Kategorier --- </option>
                    {foundCategories.map((category, i) =>
                      <option value={category.title}>
                        {category.title}
                      </option>)}
                  </select>}

                  <div>
                    Du har valt:
                    {categories.length > 0 &&
                      <ul>
                        {categories.map((category, i) =>
                          <li>{category.title}</li>
                        )}
                      </ul>
                    }
                  </div>
                </div>
              </div>
              <button type="submit">Lägg till produkt</button>
            </form>}
        </div>
      </div>
    </>
  )
}

export default App
