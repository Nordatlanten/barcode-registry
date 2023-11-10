//import { PrismaClient } from "@prisma/client";
import { Subcategory, Prisma, PrismaClient } from "@prisma/client";

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

type Product = Prisma.ProductGetPayload<{ include: { categories: true, deals: true } }>;
type Category = Prisma.CategoryGetPayload<{ include: { subcategories: true } }>;
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
      categories: {
        include: {
          subcategories: true
        }
      },
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
      categories: {
        include: {
          subcategories: true
        }
      },
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

////POST
//Product
app.post('/product', async (req, res) => {
  try {
    console.log(req.body)
    const { name, barcode, price } = req.body as Product
    const categories: Category[] = req.body.categories ? req.body.categories : []
    const deals: Deal[] = req.body.deals ? req.body.deals : []

    const newProduct = await prisma.$transaction(async (trans) => {
      var newProduct;
      newProduct = await trans.product.upsert({
        where: {
          name,
          barcode
        },
        create: {
          name,
          barcode,
          price
        },
        update: {
          categories: {
            set: []
          },
          deals: {
            set: []
          }
        },
        include: {
          categories: {
            include: {
              subcategories: true
            }
          },
          deals: true
        }
      });
      console.log("Initializing Product");
      newProduct = await trans.product.update({
        where: {
          name: name,
          barcode: barcode
        },
        data: {
          price,
          categories: {
            connectOrCreate: categories.map((category) => {
              return {
                where: { title: category.title },
                create: {
                  title: category.title,
                  subcategories: {
                    connectOrCreate: category.subcategories.map((subcategory) => {
                      return {
                        where: { title: subcategory.title },
                        create: { title: subcategory.title }
                      }
                    })
                  }
                },
              }
            })

          },
          deals: {
            set: deals.map((deal) => {
              return {
                description: deal.description,
                amount: deal.amount,
                total: deal.total
              }
            })
          }
        },
        include: {
          categories: {
            include: {
              subcategories: true
            }
          },
          deals: true
        }
      })
      return newProduct;
    });
    console.log(newProduct)


    //  var categoriesDb = [];
    //   for(var i=0; i < categories.length ; i++){
    //     const category = categories[i];
    //     categoriesDb.push(
    //       await prisma.category.upsert({
    //         where: {
    //           title: category.title,  
    //         },
    //         update: {
    //           subcategories: {
    //             connectOrCreate: category.subcategories.map((subcategory) => {
    //               return {
    //                 where: {title: subcategory.title},
    //                 create: {title: subcategory.title}
    //               }
    //             })
    //           }
    //         },
    //         create: {
    //           title: category.title,
    //           subcategories: {
    //             connectOrCreate: category.subcategories.map((subcategory) => {
    //               return {
    //                 where: {title: subcategory.title},
    //                 create: {title: subcategory.title}
    //               }
    //             })
    //           } 
    //         }
    //       })
    //     )
    //   }

    // const newProduct = await prisma.product.upsert({
    //   where:{
    //     name: name,
    //     barcode: barcode
    //   },
    //   update: {
    //     price,
    //     categories: {
    //       connect: categoriesDb.map(category => ({title: category.title})) || [],
    //     },
    //   },
    //   create: {
    //     name,
    //     barcode,
    //     price,
    //     categories: {
    //       connect: categoriesDb.map(category => ({title: category.title})) || [],
    //     },
    //   },
    // })
    console.log(await prisma.category.findMany({ include: { products: true, subcategories: true } }))
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
