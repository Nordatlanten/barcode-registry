import axios from "axios"
import { Category, FormData } from "../types/ProductTypes"

//GET

export const getCategoriesMatchingQuery = async (query: string) => {
  try {
    const result = await axios.get(`http://localhost:3000/categories/${query}`)
    return result
  } catch (error) {
    console.log(error)
  }
}


//POST

export const postNewProduct = async (e: React.FormEvent, body: FormData) => {
  e.preventDefault()
  console.log(body)
  try {
    const result = await axios.post('http://localhost:3000/product', body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return result.data
  } catch (error) {
    console.log(error)
  }
}
