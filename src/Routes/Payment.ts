import express from "express";
import PixController from "../controllers/Payment/Pix/PixController";

const PixRoutes = express.Router()

const pixController = new PixController()

PixRoutes.get('/payment/pix/generate', pixController.generatePixPayment)
PixRoutes.get('/paid(/pix)?', pixController.Paid)

export default PixRoutes