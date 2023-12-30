interface Product {
  name: string,
  barcode: string,
  price: number,
  category: Category,
  subcategory: Subcategory
  deals: Deal[]
}

interface Category {
  title: string,
  subcategories?: Subcategory[]
}

interface Subcategory {
  title: string
}

interface Deal {
  description: string,
  amount: number,
  total: number
}

interface FormData {
  barcode: string,
  name: string,
  price: number,
  category: string,
  subcategory: string,
  deals?: Deal[]
}

interface NewProduct {
  barcode: string,
  name: string,
  price: number,
  category: string,
  subcategory: string,
  deals: Deal[]
}

export type { Product, Category, Subcategory, Deal, FormData, NewProduct }
