import aws from 'aws-sdk'
import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
// @types
import { WebhookProps } from '../../@types/Admin'
import { CreateContentProps, SelectMultiplesIdsProps } from '../../@types/content'
// connection
import contentConnection from '../../Database/connections/content/contentConnection'
import tmpConnection from "../../Database/connections/payment/tmpConnection"
import finalContentConnection from '../../Database/connections/finalContent/finalContentConnection'
import adminConnection from '../../Database/connections/Admin/adminConnection'

// errors
import PaymentCustomError from '../../Errors/handlePaymentError'
// email
import sendMail from '../../Services/SendMail'

import txidGenerator from '../../Utils/txidGenerator'
class AdminController {
    async indexAllCategories(request: Request, response: Response) {
        const { type } = request.query
        
        try {
            const categories = await adminConnection('typesAndCategories')
                .where('type', '=', String(type))
                .count('category', {as: 'qtd'})
                .groupBy('category')
                .select('category')
                
                
            return response.status(200).json({type, categories})
        
        } catch (error) {
            return response.status(500).json({
                error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})        
        }
    }
    async indexAllTypes(request: Request, response: Response) {    
        try {
            const types = await contentConnection('desc')
                .groupBy('type')
                .count('type', {as: 'qtd'})
                .select('type')
                
                
            return response.status(200).json({types})
        
        } catch (error) {
            return response.status(500).json({
                error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})        
        }
    }
    async indexMultipleContentAndPricesById(request: Request, response: Response) {
        const { contentIds, priceIds }: SelectMultiplesIdsProps = request.query
        
        const trx = await contentConnection.transaction()

        try {
            if (contentIds && priceIds) {
                const contents = await trx('content')
                .join('desc', 'desc.content_id', '=', 'content.id')
                .join('rate', 'rate.content_id', '=', 'content.id')
                .whereIn('content.id', contentIds)
                .groupBy('content.id')
                .orderBy('rate.rate', 'asc')
                .select(
                    'content.id',
                    'content.registered_at',
                    'content.url',
                    
                    'desc.type',
                    'desc.category',
                    'desc.title',
                    'desc.desc',
    
                    'rate.rate'
                    )
    
                const prices = await trx('content')
                .join('price', 'price.content_id', '=', 'content.id')
                .whereIn('price.id', priceIds)
                .select(
                    'price.id',
                    'price.content_id',
                    'price.price'
                )
    
                
                return response.status(200).json({contents, prices})
            }else throw new Error('missing content and price data')
            
        } catch (error) {
            if (error.message === 'missing content and price data') {
                return response.status(400).json({error: true, message: error.message, errorMessage: error.message, errorName: error.name})
            }
        }finally {
            trx.commit()
        }
        
    }
    async indexAllTitlesAndIds(request: Request, response: Response) {
        try {
            const titles = await contentConnection('content')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .select(
                'desc.title',
                'content.id'
                )
            return response.status(200).json(titles)
            
        } catch (error) {
            return response.status(500).json({error: true, message: 'INTERNAL ERROR', errorMessage: error.message, errorName: error.name})
        }


    }
    async create(request: Request, response: Response) {
        // Time in seconds
        const { size, key: filename, location: url="" } = request.file
        const { type, category, title, desc, prices, rate=0, finalContentUrl }: CreateContentProps = request.query
        const trx = await contentConnection.transaction()
        
        try {
            
            const [registerProduct] = await trx('content')
            .insert({
                size,
                filename,
                url
                }
            )
            
            const rateRef = {
                rate,
                content_id: registerProduct,
            }

            const pricesRef = prices.map(price => { 
                return {...price, 'content_id': registerProduct}
            })
                

            await trx('desc')
                .insert({
                    type,
                    category,
                    title,
                    desc,
                    'content_id': registerProduct
                })
            await trx('price')
                .insert(pricesRef)
            
            await trx('rate')
                .insert(rateRef)
            
            if (registerProduct) {
                await finalContentConnection('final_content')
                .insert({
                    'create_id': registerProduct,
                    'url': finalContentUrl
                })

                await adminConnection('typesAndCategories')
                    .insert({type, category})
            }
                return response.status(200).json({id: registerProduct})
        
        } catch (error) {
            return response.status(500).json({
                error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        
            } finally {
            trx.commit()
        }
        
    }
    async delete(request: Request, response: Response) {
        const {id}  = request.query

        const trx = await contentConnection.transaction()

        const [content] = await trx('content')
            .where('content.id', '=', String(id))
            .select()
        if (content) {
            const filename = content.filename
            try {
                if (process.env.STORAGE_TYPE === 's3') {
                    const s3 = new aws.S3()

                    s3.deleteObject({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: String(filename)}, 
                        async function (err, data) {
                            if (err) throw new Error('Delete error: ' + err)
                    })

                    await trx('content')
                        .where('content.id', '=', String(id))
                        .delete()
                    
                    await trx('desc')
                        .where('desc.content_id', '=', String(id))
                        .delete()
                    
                    await trx('price')
                        .where('price.content_id', '=', String(id))
                        .delete()
                        
                    await trx('rate')
                        .where('rate.content_id', '=', String(id))
                        .delete()

                    await finalContentConnection('final_content')
                        .where('final_content.create_id', '=', String(id))
                        .delete()

                    await adminConnection('bestSeller')
                        .where('bestSeller.content_id', '=', String(id))
                        .delete()
                    return response.status(204).send()
                }else if(process.env.STORAGE_TYPE === 'local'){
    
                    promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${filename}`))
                    return response.status(204).send()

                }
            } catch (error) {

                return response.status(409).json({error: true, message: '409 CONFLICT', errorMessage: error.message, errorName: error.name})
            }finally {
                await trx.commit()
            }
        }else {
            await trx.commit()

            return response.status(404).send({error: true, message: 'NOT FOUND'})    

        }
        return response.status(500).send({error: true, message: 'INTERNAL ERROR'})
        


    }
    async Paid(request: Request, response: Response) {
        const pix: WebhookProps = request.body.pix[0]
        if(pix) {
            try {
                const debtor: {name: string, phone: string, email: string, txid: string} = 
                await tmpConnection('tmp_debtor')
                    .where('txid', '=', pix.txid)
                    .select('name', 'phone', 'email', 'txid')

                const contents = await tmpConnection('tmp_cart')
                    .where('txid', '=', pix.txid)
                    .select('content_id', 'price', 'txid')

                const contentIds = contents.map(content => content.content_id)

                const finalContentsUrl = await finalContentConnection('final_content')
                    .whereIn('create_id', contentIds)
                    .select('create_id', 'url')

                const registerPaidPix = await tmpConnection('tmp_paid')
                    .insert({txid: pix.txid})

                    const send = await sendMail(debtor, finalContentsUrl, contents)

                    return response.status(204).send()
                
            } catch (error) {
                if (error instanceof PaymentCustomError) {

                    return response.status(400).json({name: error.name, errors: [error.errors] })
                }
                return response.status(500).json({message: 'Ocorreu um erro interno ao gerar o pagamento. Por favor, tente novamente', error: error})
            }    
        }else {
            return response.send('200')
        
        }
    }
    async PaymentConfirmation (request: Request, response: Response) {
        const { txid } = request.query
        
        try {
            const [isPaid] = await tmpConnection('tmp_paid')
                .where('txid', '=', txid)
    
            if (isPaid) {
                return response.status(200).json({error: false, paid: true})
            }else {
                return response.status(404).json({error: false, paid: false})
            }
            
            
        } catch (error) {
            return response.status(500).send({error: true, message: 'INTERNAL ERROR'})
            
        }
    }
    async uuidGenerate(request: Request, response: Response) {
        return response.status(200).send(txidGenerator())
        // enviar por email
    }
}

export default AdminController