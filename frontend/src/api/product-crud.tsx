import axios from "axios"
import { Category, FormData } from "../types/ProductTypes"

//GET

export const getDataMatchingQuery = async (query: string, endpoint: string) => {
  try {
    const result = await axios.get(`http://localhost:3000/${endpoint}/${query}`)
    return result.data as Category[]
  } catch (error) {
    console.log(error)
  }
}

export const getSubcategoriesOfCategory = async (query: string, category: string) => {
  console.log(query, category)
  try {
    const result = await axios.get(`http://localhost:3000/categories/${category}/${query}`)
    console.log(result.data)
    return result.data[0] as Category
  } catch (error) {
    console.log(error)
  }
}


//POST

export const postNewProduct = async (body: FormData) => {

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
