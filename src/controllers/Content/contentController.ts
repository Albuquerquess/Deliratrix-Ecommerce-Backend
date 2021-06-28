import { Request, Response } from 'express'
import aws from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import contentConnection from '../../Database/connections/content/contentConnection'

// @types
import { CreateContentProps } from '../../@types/content'

class ProductController {
    async index(request: Request, response: Response) {
        const { type } = request.query

        try {
            const content = await contentConnection('content')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('desc.type', '=', String(type))
            .select(
                'content.id',
                'content.url',
                'content.filename',
                'content.registered_at',

                'desc.title',
                'desc.desc',
                'desc.time',
                'desc.registered_at',
                
                'price.price',
                'price.label',
    
                'rate.rate'
                )

                return response.status(200).json(content)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async indexOfCategory(request: Request, response: Response) {
        const { type, category } = request.query

        try {
            const content = await contentConnection('content')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('desc.type', '=', String(type))
            .where('desc.category', '=', String(category))
            .select(
                'content.id',
                'content.url',
                'content.filename',
                'content.registered_at',

                'desc.title',
                'desc.desc',
                'desc.time',
                'desc.registered_at',
                
                'price.price',
                'price.label',
    
                'rate.rate'
                )

                return response.status(200).json(content)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async bests(request: Request, response: Response) {
        const {type} = request.query
        
        try {
            const bestsProducts = await contentConnection('content')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('desc.type', '=', String(type))
            .max('rate.rate')
            .select(
                'content.id',
                'content.url',
                'content.filename',
                'content.registered_at',

                'desc.title',
                'desc.desc',
                'desc.time',
                'desc.registered_at',
                
                'price.price',
                'price.label',
    
                'rate.rate'
                )

            return response.status(200).json(bestsProducts)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }


    }
    async search(request: Request, response: Response) {
        const {type, search} = request.query

        try {
            const content = await contentConnection('content')
        .join('desc', 'desc.content_id', '=', 'content.id')
        .join('price', 'price.content_id', '=', 'content.id')
        .join('rate', 'rate.content_id', '=', 'content.id')
        .where('desc.type', '=', String(type))
        .orWhere('desc.title', 'like', `%${String(search)}%`)
        .orWhere('desc.desc', 'like', `%${String(search)}%`)
        .select(
            'content.id',
            'content.url',
            'content.filename',
            'content.registered_at',

            'desc.title',
            'desc.desc',
            'desc.time',
            'desc.registered_at',
            
            'price.price',
            'price.label',

            'rate.rate'
            )
            return response.status(200).json(content)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})            
        }
    }
    async create(request: Request, response: Response) {
        // Time in seconds
        const { size, key: filename, location: url="" } = request.file
        const { type, category, title, desc, prices }: CreateContentProps = request.query
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
            
            const pricesRef = pricesParse.map(price => { 
                return {...price, 'content_id': 0}
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

            await trx.commit()
            return response.status(200).json({a: 0})
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        } finally {
            trx.commit()
        }
        
    }
    async delete(request: Request, response: Response) {
        const {filename}  = request.query
       
        try {
            if (process.env.STORAGE_TYPE === 's3') {
                const s3 = new aws.S3()
    
                await s3.deleteObject({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `${filename}`
                }).promise()
    
                return response.status(204).send()
            }else if(process.env.STORAGE_TYPE === 'local'){

                promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${filename}`))
                console.log('deleted')
                return response.status(204).send()
            }
        } catch (error) {
            return response.status(409).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
        return response.status(500).send({error: true, message: 'Ocorreu um erro, por favor tente novamente'})
        


    }
}

export default ProductController