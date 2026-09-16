import express from 'express'

const HOST = 'localhost'
const PORT = 3000

const app = express()

const products = [
  { id: 1, name: 'Laptop', price: 1200, category: 'electronics' },
  { id: 2, name: 'Smartphone', price: 800, category: 'electronics' },
  { id: 3, name: 'Headphones', price: 150, category: 'electronics' },
  { id: 4, name: 'Desk Chair', price: 250, category: 'furniture' },
  { id: 5, name: 'Coffee Table', price: 180, category: 'furniture' }
]

app.get('/products', (req, res) => {
  const { take, category } = req.query
  let result = [...products]

  if (category) {
    result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase()

    )
  }

  if (take) {
    const limit = Number(take)
    if (!isNaN(limit) && limit > 0) {
      result = result.slice(0, limit)
    }
  }

  res.json(result)
})

app.get('/products/:id', (req, res) => {
  const { id } = req.params
  const productId = Number(id)

  if (isNaN(productId)) {
    return res.status(400).json({ message: 'Invalid product ID' })
  }

  const product = products.find((p) => p.id === productId)

  if (!product) {
    return res.status(404).json({ message: 'Product not found' })
  }

  res.json(product)
})

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
})