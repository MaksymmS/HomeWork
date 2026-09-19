import express from 'express'

const HOST = 'localhost'
const PORT = 3000

const app = express();
app.use(express.json());

const products = [
  { id: 1, name: 'Laptop', price: 1200, category: 'electronics', image: '' },
  { id: 2, name: 'Smartphone', price: 800, category: 'electronics', image: '' },
  { id: 3, name: 'Headphones', price: 150, category: 'electronics', image: '' },
  { id: 4, name: 'Desk Chair', price: 250, category: 'furniture', image: '' },
  { id: 5, name: 'Coffee Table', price: 180, category: 'furniture', image: '' }
]

const addProduct = (newProduct, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    if (shouldFail) {
      reject(new Error('Failed to save product to database'))
    } else {
      products.push(newProduct)
      resolve(newProduct)
    }
  })
};

app.get('/products', (req, res) => {
  const { take, category } = req.query
  let result = [...products]

  if (category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
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

app.post('/products', async (req, res) => {
  const { name, price, category, image } = req.body
  const isFail = req.query.fail === 'true'

  const isNameValid = typeof name === 'string' && name.trim() !== ''
  const isPriceValid = typeof price === 'number' && !isNaN(price) && price > 0
  const isCategoryValid = typeof category === 'string' && category.trim() !== ''

  if (!isNameValid || !isPriceValid || !isCategoryValid) {
    return res.status(422).json({ message: 'Invalid product data' })
  }

  const isDuplicate = products.some(
    (p) => p.name.toLowerCase() === name.trim().toLowerCase()
  )

  if (isDuplicate) {
    return res.status(409).json({ message: 'Conflict: Product already exists' })
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name: name.trim(),
    price,
    category: category.trim(),
    image: typeof image === 'string' ? image : ''
  }

  try {
    const savedProduct = await addProduct(newProduct, isFail)
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
})