import { Request, Response } from "express";
import PaymentGNAPI from '../../../Services/API/PaymentGNAPI'
import { ChargeProps, DebtorProps } from '../../../@types/payment'
import RandomTxid from "../../../utils/txidGenerator";

import PaymentCustomError from '../../../Errors/handlePaymentError'

class PixController {
    // Resolver sobre tratamento de erros
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

            
            // if (!charge.status ==! 200) throw new PaymentCustomError({
            //     errors: ["Não foi possivel criar a cobrança"]
            // });
            
            const locID = charge.data?.loc.id
            
            const qrCode = await api.get(`/v2/loc/${locID}/qrcode`)
            
            // if (!qrCode.status ==! 200) throw new PaymentCustomError({
            //     errors: ["Não foi possivel crar o qrcode"]
            // });

            return response.json({
                chargeRaw: qrCode.data.qrcode,
                qrcode: qrCode.data.imageQrcode
            })
        } catch (error) {
            if (error instanceof PaymentCustomError) return response.status(400).json({name: error.name, errors: error.errors   })

            console.log(error.response.status)
        }   
        
    }

    async Paid(request: Request, response: Response) {
        
        return response.send('200')
    }
}

export default PixController
