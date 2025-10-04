import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js'
import connectDB from './src/config/mongodb.js'
import connectCloudinary from './src/config/cloudinary.js'
import albumRouter from './src/routes/albumRoute.js'

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cors())

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
app.use('/api/album', albumRouter)

app.get('/', (req, res) => res.status(200).send('api working'))

app.listen(port, () => console.log(`Listening on port ${port}`))
