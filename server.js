import express from 'express'

const HOST = 'localhost'
const PORT = 3000

const app = express()

app.get('/timestamp', (req, res) => {
    const date = new Date()

    res.json({ 
        timestamp: date.toISOString(),
        time: date.getTime()
        
    })
})

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})