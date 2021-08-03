import { Request, Response } from "express";
import { CartProps, DebtorProps } from '../../../@types/payment';
import contentConnection from '../../../Database/connections/content/contentConnection';
import tmpConnection from "../../../Database/connections/payment/tmpConnection";
import PaymentCustomError from '../../../Errors/handlePaymentError';
import PaymentGNAPI from '../../../Services/API/PaymentGNAPI';
import RandomTxid from "../../../Utils/txidGenerator";
class PixController {
    // Usar wildcards para validar os dados de pagamento vindo do request em src/middleware/payment/paymentDataValidator.ts
    async generatePixPayment(request: Request, response: Response) {
        const cart: CartProps = request.body.cart
        const debtor: DebtorProps = request.body.debtor

        const cartContents = cart.contents
        const cartPrices = cart.prices
        
        const txid = RandomTxid()
        const api = await PaymentGNAPI()
        const tmpTrx = await tmpConnection.transaction()
        
        const cartContentsRef = cartContents.map(content => {return {...content, txid}})
        const contentIds = cartContentsRef.map(content => content.id)
        const priceIds = cartPrices.map(price => price.id)

        const [price] = await contentConnection('price')
        .whereIn('price.id', priceIds)
        .select('price.price')

        const finalPrice = price.price
              
        
        const dataCharge = {
            "calendario": {
              "expiracao": 3600
            },
            "valor": {
              "original": finalPrice.toFixed(2)
            },
            "chave": process.env.GN_PIX_KEY,
            "solicitacaoPagador": "Informe o número ou identificador do pedido."
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
            const TMPDebtor = await tmpTrx('tmp_debtor')
                .insert({...debtor, txid})

            if (!TMPDebtor.length) throw new PaymentCustomError({
            errors: ["Não foi possivel cadastrar os dados do carrinho."]
            });

            const contents = await contentConnection('content')
            .join('price', 'price.content_id', '=', 'content.id')
            .whereIn('content.id', contentIds)
            .whereIn('price.id', priceIds)
            .select(
                'price.price',
                'price.content_id')

            const contentsRef = contents.map(content => {
                return {...content, txid, debtor_id: TMPDebtor[0]}
            })

            const TMPCart = await tmpTrx('tmp_cart')
            .insert(contentsRef)

            if (!TMPCart.length) throw new PaymentCustomError({
                errors: ["Não foi possivel cadastrar os dados do carrinho."]
                });

                console.log('Pagamento cadastrado com txid: '+txid)

            return response.json({
                chargeRaw: qrCode.data.qrcode,
                qrcode: qrCode.data.imagemQrcode,
                txid: txid
            })
            
        } catch (error) {
            if (error instanceof PaymentCustomError) {

                return response.status(400).json({name: error.name, errors: [error.errors] })
            }
            console.log(error)
            return response.status(500).json({message: 'Ocorreu um erro interno ao gerar o pagamento. Por favor, tente novamente', error: error})
        }finally {
            tmpTrx.commit()
        }
        
    }
// Finalizar envio de emails

}

export default PixController
