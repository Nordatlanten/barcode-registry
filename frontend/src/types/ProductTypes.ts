interface Product {
  name: string,
  barcode: string,
  price: number,
  categories: Category[],
  subcategories: Subcategory[]
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

export type { Product, Category, Subcategory, Deal }
