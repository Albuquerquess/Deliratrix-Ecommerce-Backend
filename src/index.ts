import express from 'express'
import cors from 'cors'
import path from 'path'
// envs
import dotenv from 'dotenv'

// routes
import ContentRoutes from './Routes/Content'
import AdminRoutes from './Routes/Admin'
import PaymentGNAPI from './Routes/Payment'


const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}

if (process.env.NODE_ENV === 'dev') dotenv.config()

const app = express()

app.use(cors(corsOptions))
app.use(express.json())

// Routes
app.use(PaymentGNAPI)
app.use(ContentRoutes)
app.use(AdminRoutes)

app.get('/', (request, response) => {
    return response.send(`DeliraStore Server ${new Date().toLocaleString()}`)
})

app.listen(process.env.PORT || 3333, () => {
    return console.log('Rodando -- http://localhost:'+(process.env.PORT || 3333))
})