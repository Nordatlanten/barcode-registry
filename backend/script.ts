//import { PrismaClient } from "@prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";

import express from 'express'
import cors from 'cors'

const allowedOrigins = ['http://localhost:5173'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};


const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(cors(options))

type Product = Prisma.ProductGetPayload<{ include: { category: true, subcategory: true, deals: true } }>;
type Category = Prisma.CategoryGetPayload<{ include: { products: true, subcategories: true } }>;
type Subcategory = Prisma.SubcategoryGetPayload<{ include: { products: true, category: true } }>;
type Deal = Prisma.DealGetPayload<{ include: { products: true } }>;



// interface Product {
//   id: number,
//   name: string,
//   barcode: string,
//   price: number,
//   categories: Category[],
//   deals?: Deal[]
// }

// interface Category {
//   id: number,
//   title: string,
//   subcategories?: Subcategory[]
// }

// interface Subcategory {
//   id: number,
//   title: string,
// }

// interface Deal {
//   id: number,
//   description: string,
//   amount: number,
//   total: number
// }

////GET
//All products
app.get('/products', async (_req, res) => {
  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      subcategory: true,
      deals: true
    }
  })
  res.json(allProducts)
})

//Product by barcode
app.get('/products/:barcode', async (req, res) => {
  const product = await prisma.product.findUnique(({
    where: {
      barcode: req.params.barcode
    },
    include: {
      category: true,
      subcategory: true,
      deals: true
    }
  }))
  res.status(200).json(product)
})

//Categories
app.get('/categories', async (req, res) => {
  const categories = await prisma.category.findMany(({
    include: {
      subcategories: true
    }
  }))
  res.status(200).json(categories)
})

app.get('/categories/:query', async (req, res) => {
  try {
    const categories = await prisma.category.findMany(({
      where: {
        title: {
          contains: req.params.query
        }
      },
      include: {
        subcategories: true
      }
    }))
    res.status(200).json(categories)
  } catch (error) {
    console.error(error)
  }
})

//Subcategories within category
app.get('/categories/:category/:query', async (req, res) => {
  try {
    const subcategories = await prisma.category.findMany(({
      where: {
        title: {
          contains: req.params.category
        }
      },
      include: {
        subcategories: {
          where: {
            title: {
              contains: req.params.query
            }
          }
        }
      }
    }))
    res.status(200).json(subcategories)
  } catch (error) {
    console.error(error)
  }
})


////POST
//Product
app.post('/product', async (req, res) => {
  try {
    console.log(req.body)
    const { name, barcode, price } = req.body as Product
    const category: string = req.body.category
    const subcategory: string = req.body.subcategory
    //const categories: Category[] = req.body.categories ? req.body.categories : []
    const deals: Deal[] = req.body.deals ? req.body.deals : []
    // await prisma.product.deleteMany();
    // await prisma.category.deleteMany();
    // await  prisma.subcategory.deleteMany();
    // await  prisma.deal.deleteMany();

    const newProduct = await prisma.$transaction(async (trans) => {
      let newProduct, categoryDb, subcategoryDb;
      categoryDb = await prisma.category.findUnique({ where: { title: category } })
      if (!categoryDb) { //If category or subcategory don't exist, make them, just in case
        categoryDb = await trans.category.create({
          data: {
            title: category
          }
        })
      }
      if (subcategory) {
        subcategoryDb = await prisma.subcategory.findUnique({ where: { title: subcategory } })
        if (!subcategoryDb) {
          subcategoryDb = await trans.subcategory.create({
            data: {
              title: subcategory,
              category: {
                connect: { title: category }
              }
            }
          })
        }
      }

      newProduct = await trans.product.upsert({
        where: {
          name,
          barcode
        },
        create: {
          name,
          barcode,
          price,
          category: {
            connect: { title: category }
          },
          subcategory: subcategory ? { connect: { title: subcategory } } : undefined,
        },
        update: {
          category: {
            connect: { title: category }
          },
          subcategory: subcategory ? { connect: { title: subcategory } } : undefined,
          deals: {
            connect: deals.map(deal => { return { description: deal.description } })
          }
        },
        include: {
          category: true,
          subcategory: true,
          deals: true
        }
      });
      console.log("Initializing Product");
      return newProduct;
    });
    console.log(JSON.stringify(newProduct))

    console.log(await prisma.product.findMany({ include: { category: true, subcategory: true, deals: true } }))
    res.json(newProduct)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
})

////DELETE
//Product by barcode



const server = app.listen(3000, () => {
  console.log('server listening to port 3000....')
})
