import axios from "axios"
import { Product } from "../types/ProductTypes"

export const postNewProduct = async (e: React.FormEvent, body: Product) => {
  e.preventDefault()
  console.log(body)
  const result = await axios.post('http://localhost:3000/product', body, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return result
}
