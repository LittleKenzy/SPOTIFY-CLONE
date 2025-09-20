import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js'
import connectDB from './src/config/mongodb.js'
import connectCloudinary from './src/config/cloudinary.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors())

// Raw body parser for debugging
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            req.rawBody = data;
            next();
        });
    } else {
        next();
    }
})

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`)
    console.log('Headers:', req.headers)
    console.log('Body:', req.body)
    console.log('Raw body:', req.rawBody)
    next()
})

// initializing routes
app.use('/api/song', songRouter)

app.get('/', (req, res) => res.status(200).send('api working'))

app.listen(port, () => console.log(`Listening on port ${port}`))
