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
AdminRoutes.get('/admin/index/titles', adminController.indexAllTitlesAndIds)
AdminRoutes.get('/admin/panel/uuid/generate', adminController.uuidGenerate)

AdminRoutes.post('/admin/create', multer(multerconfig).single('file'), adminController.create)

AdminRoutes.delete('/admin/delete', adminController.delete)

// webhoox
AdminRoutes.post('/paid(/pix)?', adminController.Paid)

export default AdminRoutes