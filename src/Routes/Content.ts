import express from "express";
import multer from "multer";
import multerconfig from "../Config/multerconfig";

// Controller
import ProductController from "../controllers/Content/productController";
const productController = new ProductController();

const ContentRoutes = express.Router()

ContentRoutes.get('/service/bests', () => {return ['Lista os 3 serviços com melhores avaliações']})
ContentRoutes.get('/service', () => {return ['Lista os serviços ordenada com a data de criação']})
ContentRoutes.get('/service:id', () => {return ['Lista os serviços de acordo com o seu id']})

// Content
ContentRoutes.get('/product/', productController.index)
ContentRoutes.get('/product/bests/', productController.bests)
ContentRoutes.get('/product/category/', productController.indexOfCategory)
ContentRoutes.get('/product/search', productController.search)

ContentRoutes.post('/product/create', multer(multerconfig).single('file'), productController.create)
ContentRoutes.delete('/product/delete', productController.delete)


export default ContentRoutes