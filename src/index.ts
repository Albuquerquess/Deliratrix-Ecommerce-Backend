import express from 'express'
import cors from 'cors'
import PaymentGNAPI from './Routes/Payment'

// envs
import dotenv from 'dotenv'
import ContentRoutes from './Routes/Content'
if (process.env.NODE_ENV === 'dev') dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use(PaymentGNAPI)
// Routes
app.use(ContentRoutes)

app.get('/', (request, response) => {
    return response.send(`DeliraStore Server ${new Date().toLocaleString()}`)
})

app.listen(3333, () => {
    return console.log('Rodando -- http://localhost:3333/')
})

// Criar um arquivo de rotas para cada tipo de requisição (produto, pagamento, clientes...)
// implementar pagamento por PIX