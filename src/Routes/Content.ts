import express from "express";


const ContentRoutes = express.Router()
// Finalizar migratins
ContentRoutes.get('/service/bests', () => {return ['Lista os 3 serviços com melhores avaliações']})
ContentRoutes.get('/service', () => {return ['Lista os serviços ordenada com a data de criação']})
ContentRoutes.get('/service:id', () => {return ['Lista os serviços de acordo com o seu id']})

ContentRoutes.get('/product/bests', () => {return ['Lista os 3 produtos com melhores avaliações']})
ContentRoutes.get('/product', () => {return ['Lista os produtos ordenada com a data de criação']})
ContentRoutes.get('/product/:category', () => {return ['Lista os produtos de acordo com a categoria']})
ContentRoutes.get('/product/:category/:id', () => {return ['Lista os produto de acordo com a categoria e o seu ID']})


ContentRoutes.get('/index/:search', () => {return ['Lista os produto e serviços de acordo com a pesquisa']})


export default ContentRoutes