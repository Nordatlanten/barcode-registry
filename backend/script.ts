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

// get all deals
app.get('/deals', async (req, res) => {
  try {
    const deals = await prisma.deal.findMany(({
      include: {
        products: true
      }
    }))
    res.status(200).json(deals)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
});

// create a deal, add a description, add the amount and total, then add specific products to the deals
app.post('/deals', async (req, res) => {
  try {
    console.log(req.body)
    const description: string = req.body.description
    const amount: number = req.body.amount
    const total: number = req.body.total
    const filter: string = req.body.filter
    const products: Product[] = req.body.products ? req.body.products : []

    const newDeal = await prisma.$transaction(async (trans) => {
      console.log("Creating or updating deal");
      return await trans.deal.upsert({
        where: {
          description,
        },
        create: {
          description,
          amount,
          total,
          filter,
          products: { connect: products.map(product => { return { name: product.name } }) }
        },
        update: {
          amount,
          total,
          filter,
          products: { set: products.map(product => { return { name: product.name } }) }
        },
        include: {
          products: true,
        }
      });

    });
    console.log(JSON.stringify(newDeal))

    console.log(await prisma.deal.findMany({ include: { products: true, } }))
    res.json(newDeal)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
});
// delete a deal (remove from all products)
app.delete('/deals', async (req, res) => {
  try {
    console.log(req.body)
    const description: string = req.body.description

    const newDeal = await prisma.$transaction(async (trans) => {
      console.log("Deleting deal");
      return await trans.deal.delete({
        where: {
          description,
        }
      })
    });
    console.log(JSON.stringify(newDeal))

    console.log(await prisma.deal.findMany({ include: { products: true, } }))
    res.json(newDeal)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
});

// delete a deal from a products (I need to add something to allow it to use barcode also, but this is good for now)
app.delete('/product_deals', async (req, res) => {
  try {
    console.log(req.body)
    const description: string = req.body.description
    const name: string = req.body.name
    //const barcode: string = req.body.barcode

    const newDeal = await prisma.$transaction(async (trans) => {
      console.log("Deleting deal");
      return await trans.product.update({
        where: {
          name: name
        },
        data: {
          deals: {
            disconnect: {
              description: description
            }
          }
        },
        include: {
          deals: true,
        }
      })
    });
    console.log(JSON.stringify(newDeal))
    console.log(await prisma.deal.findMany({ include: { products: true, } }))
    res.json(newDeal)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
});

// given a list of products, get deals on products
app.get('/product_deals', async (req, res) => {
  try {
    console.log(req.body)
    const products: Product[] = req.body.products ? req.body.products : []

    const deals = await prisma.deal.findMany(({
      where: {
        products: {
          some: {}
        }
      },
      include: {
        products: true
      }
    }))
    console.log(JSON.stringify(deals))
    res.json(deals)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
});


const server = app.listen(3000, () => {
  console.log('server listening to port 3000....')
})
