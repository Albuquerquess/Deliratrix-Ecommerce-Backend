import express from "express";
import multer from "multer";
import multerconfig from "../Config/multerconfig";

// Controller
import AdminController from "../controllers/Admin/AdminController";
const adminController = new AdminController();

const AdminRoutes = express.Router()
// Content
AdminRoutes.get('/admin/index/categories',adminController.indexAllCategories)
AdminRoutes.get('/admin/index/types',adminController.indexAllTypes)
AdminRoutes.get('/admin/cart/index',adminController.indexMultipleContentAndPricesById)

AdminRoutes.post('/content/create', multer(multerconfig).single('file'), adminController.create)

AdminRoutes.delete('/content/delete', adminController.delete)

export default AdminRoutes