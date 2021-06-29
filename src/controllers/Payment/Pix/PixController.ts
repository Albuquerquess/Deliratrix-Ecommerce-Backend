import { Request, Response } from "express";
import nodemailer from 'nodemailer'

import { ChargeProps, DebtorProps, WebhookProps } from '../../../@types/payment'
import RandomTxid from "../../../utils/txidGenerator";

import PaymentGNAPI from '../../../Services/API/PaymentGNAPI'
import tmpConnection from "../../../Database/connections/payment/tmpConnection";

import PaymentCustomError from '../../../Errors/handlePaymentError'

class PixController {
    // Usar wildcards para validar os dados de pagamento vindo do request em src/middleware/payment/paymentDataValidator.ts
    async generatePixPayment(request: Request, response: Response) {
        const cart: ChargeProps[] = request.body.cart
        const debtor: DebtorProps = request.body.debtor
        
        const cardParse = JSON.parse(cart)

        const txid = RandomTxid()
        const api = await PaymentGNAPI()
        const fullValue = String((cardParse.reduce((full, item) => full + item.value, 0)).toFixed(2))
        const note = cardParse.map((item, index) => {
            return `${index} | id: ${item.id} - Nome: ${item.name} - Valor: R$:${item.value.toFixed(2)}\n`
        })

        const cartRef = cardParse.map((item, index) => {
            return {id_content: item.id, name: item.name, value: item.value, txid}
        })
        
        const dataCharge = {
            calendario: {
                expiracao: 3600
            },
            valor: {
                original: fullValue
            },
            chave: process.env.GN_PIX_KEY,
            // solicitacaoPagador: `${note}, Total: R$:${fullValue}\n\n Comprador: ${debtor.name}, ${debtor.email}, ${debtor.phone}`
        }
        
        try {
            const charge = await api.put(`/v2/cob/${txid}`, dataCharge)

            if (!(charge.status === 200 || charge.status === 201)) throw new PaymentCustomError({
                errors: ["Não foi possivel criar a cobrança."]
            });

            const locID = charge.data?.loc.id
            
            const qrCode = await api.get(`/v2/loc/${locID}/qrcode`)
            
            if (!(qrCode.status === 200 || qrCode.status === 201)) throw new PaymentCustomError({
                errors: ["Não foi possivel criar o qrcode."]
            });

            // Salvando dados temporários de pagamento
            const TMPInfos = await tmpConnection('payment')
                .insert({...debtor, txid})

            if (!TMPInfos.length) throw new PaymentCustomError({
                errors: ["Não foi possivel cadastrar os dados."]
            });

            // Salvando dados temporários do carrinho
            const TMPCart = await tmpConnection('cart')
                .insert(cartRef)

            if (!TMPCart.length) throw new PaymentCustomError({
            errors: ["Não foi possivel cadastrar os dados do carrinho."]
            });

            return response.json({
                chargeRaw: qrCode.data.qrcode,
                qrcode: qrCode.data.imagemQrcode,
                txid: txid
            })
            
        } catch (error) {
            if (error instanceof PaymentCustomError) {
                console.log(error)

                return response.status(400).json({name: error.name, errors: [error.errors] })
            }
            console.log(error)
            return response.status(500).json({message: 'Ocorreu um erro interno ao gerar o pagamento. Por favor, tente novamente', error: error})
        }   
        
    }
// Finalizar envio de emails
    async Paid(request: Request, response: Response) {
        const pix: WebhookProps = request.body.pix[0]

        if(pix) {
            try {
                const userInfos = await tmpConnection('payment')
                .where('payment.txid', '=', String(pix.txid))
                .select('*')
    
            
                if (!userInfos.length) throw new PaymentCustomError({
                    errors: ["Não foi possivel recuperar os seus dados, envie o comprovante de pagamento via pix para o suporte@delatrix.com"]
                });


                const transporterConfig = {
                    host: process.env.SMTP_SERVER,
                    port: process.env.SMTP_PORT,
                    auth: {
                      user: process.env.EMAIL_USER,
                      pass: process.env.EMAIL_PASSWD,
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                  }
                const transporter = nodemailer.createTransport(transporterConfig);
              
                // send mail with defined transport object
                const info = await transporter.sendMail({
                  from: `DeliraStore - ${process.env.EMAIL_USER}`, // sender address
                  to: userInfos[0].email, // list of receivers
                  subject: "Hello ✔", // Subject line
                  html: `
                  <h1>DeliraStore</h1>
                    <p>${JSON.stringify( userInfos[0], null, 2)}</p>
                  `, // html body
                });
              
                console.log("Message sent: %s", info.messageId);
              
                return response.status(200).send('Email enviado')
            } catch (error) {
                if (error instanceof PaymentCustomError) {
                    console.log(error.stack)
    
                    return response.status(400).json({name: error.name, errors: [error.errors] })
                }
                console.log(error.stack)
                return response.status(500).json({message: 'Ocorreu um erro interno ao gerar o pagamento. Por favor, tente novamente', error: error})
            }    
        }else {
            return response.send('200')
        }
    }
}

export default PixController
