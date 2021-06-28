import express from "express";
import multer from "multer";
import multerconfig from "../Config/multerconfig";

// Controller
import ContentController from "../controllers/Content/contentController";
const contentController = new ContentController();

const ContentRoutes = express.Router()
// Content
ContentRoutes.get('/content/', contentController.index)
ContentRoutes.get('/content/bests/', contentController.bests)
ContentRoutes.get('/content/category/', contentController.indexOfCategory)
ContentRoutes.get('/content/search', contentController.search)

ContentRoutes.post('/content/create', multer(multerconfig).single('file'), contentController.create)
ContentRoutes.delete('/content/delete', contentController.delete)


export default ContentRoutes