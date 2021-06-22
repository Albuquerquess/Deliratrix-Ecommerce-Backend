import { Request, Response } from "express";
import nodemailer from 'nodemailer'

import PaymentGNAPI from '../../../Services/API/PaymentGNAPI'
import { ChargeProps, DebtorProps } from '../../../@types/payment'
import RandomTxid from "../../../utils/txidGenerator";
import PaymentCustomError from '../../../Errors/handlePaymentError'

class PixController {
    // Usar wildcards para validar os dados de pagamento vindo do request em src/middleware/payment/paymentDataValidator.ts
    async generatePixPayment(request: Request, response: Response) {
        const cart: ChargeProps[] = request.body.cart
        const debtor: DebtorProps = request.body.debtor
        
        const txid = RandomTxid()
        const api = await PaymentGNAPI()
        const fullValue = String((cart.reduce((full, item) => full + item.value, 0)).toFixed(2))
        
        const note = cart.map((item, index) => {
            return `${index} | id: ${item.id} - Nome: ${item.name} - Valor: R$:${item.value.toFixed(2)}`
        })
        
        const dataCharge = {
            calendario: {
                expiracao: 3600
            },
            valor: {
                original: fullValue
            },
            chave: process.env.GN_PIX_KEY,
            solicitacaoPagador: `${note}, Total: R$:${fullValue}\n\n Comprador: ${debtor.name}, ${debtor.cpf}`
        }
        
        try {
            const charge = await api.put(`/v2/cob/${txid}`, dataCharge)

            if (!(charge.status === 200 || charge.status === 201)) throw new PaymentCustomError({
                errors: ["Não foi possivel criar a cobrança"]
            });
            
            const locID = charge.data?.loc.id
            
            const qrCode = await api.get(`/v2/loc/${locID}/qrcode`)
            
            if (!(qrCode.status === 200 || qrCode.status === 201)) throw new PaymentCustomError({
                errors: ["Não foi possivel crar o qrcode"]
            });

            return response.json({
                chargeRaw: qrCode.data.qrcode,
                qrcode: qrCode.data.imageQrcode
            })
        } catch (error) {
            if (error instanceof PaymentCustomError) {
                console.log(error.stack)

                return response.status(400).json({name: error.name, errors: [error.errors] })
            }

            return response.status(500).json({message: 'Ocorreu um erro interno ao gerar o pagamento. Por favor, tente novamente'})
        }   
        
    }

    async saveData(request: Request, response: Response) {
        const { email, name, phone } = request.body
    }

    async Paid(request: Request, response: Response) {
        const transporter = nodemailer.createTransport({
            host: String(process.env.SMTP_SERVER),
            port: String(process.env.SMTP_PORT),
            auth: {
                user: String(process.env.EMAIL_USER),
                pass: String(process.env.EMAIL_PASSWD)
            }
        })
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: 'albuquerque.develop@gmail.com',
            subject: 'Titulo',
            text: 'Texto'
        })
        
        return response.send('200')
    }
}

export default PixController
