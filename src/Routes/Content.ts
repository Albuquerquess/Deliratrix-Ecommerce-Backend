import express from "express";

// Controller
import ContentController from "../controllers/Content/contentController";
const contentController = new ContentController();

const ContentRoutes = express.Router()
// Content
ContentRoutes.get('/content/', contentController.index)
ContentRoutes.get('/content/show', contentController.show)
ContentRoutes.get('/content/bests/', contentController.bests)
ContentRoutes.get('/content/category/', contentController.indexOfCategory)

// rate
ContentRoutes.get('/content/search/', contentController.search)


export default ContentRoutes