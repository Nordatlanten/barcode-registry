import axios from "axios"
import { FormData } from "../types/ProductTypes"

export const postNewProduct = async (e: React.FormEvent, body: FormData) => {
  e.preventDefault()
  console.log(body)
  try {
    const result = await axios.post('http://localhost:3000/product', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return result
  } catch (error) {
    console.log(error)
  }
}
