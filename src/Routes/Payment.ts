import express from "express";
import PixController from "../Controllers/Payment/Pix/PixController";

const PixRoutes = express.Router()

const pixController = new PixController()

PixRoutes.post('/payment/pix/generate', pixController.generatePixPayment)

export default PixRoutes