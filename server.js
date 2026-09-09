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

app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    })
})

app.get('/status', (req, res) => {
    res.json({
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    })
})

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
})