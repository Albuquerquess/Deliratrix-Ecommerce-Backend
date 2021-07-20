import { Request, Response } from 'express'

import aws, { Textract } from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// @types
import { CreateContentProps, SelectMultiplesIdsProps } from '../../@types/content'

// connection
import contentConnection from '../../Database/connections/content/contentConnection'

class AdminController {
    async indexAllCategories(request: Request, response: Response) {
        const { type } = request.query
        
        try {
            
            const categories = await contentConnection('desc')
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
        } catch (error) {
            
        }finally {
            trx.commit()
        }
        
    }

    async create(request: Request, response: Response) {
        // Time in seconds
        const { size, key: filename, location: url="" } = request.file
        const { type, category, title, desc, prices, rate }: CreateContentProps = request.query
        const pricesParse = JSON.parse(prices)
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

        const pricesRef = pricesParse.map(price => { 
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

            await trx.commit()
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

        const [{filename}] = await trx('content')
            .where('content.id', '=', String(id))
            .select('content.filename')
       
        if (filename) {
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
        
                    return response.status(204).send()
                }else if(process.env.STORAGE_TYPE === 'local'){
    
                    promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${filename}`))
                    console.log('deleted')
                    return response.status(204).send()
                }
            } catch (error) {
                console.log(error)
                return response.status(409).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
            }finally {
                await trx.commit()
            }
        }else {
            return response.status(404).send({error: true, message: 'Não foi possivel encontrar o conteúdo'})    
        }
        return response.status(500).send({error: true, message: 'Ocorreu um erro, por favor tente novamente'})
        


    }
}

export default AdminController