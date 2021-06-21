import { Request, Response } from 'express'
import aws from 'aws-sdk'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import productsConnection from '../../Database/connections/content/Products/productConnections'

// @types
import { CreateContentProps } from '../../@types/content'

class ProductController {
    async index(request: Request, response: Response) {
        const { type } = request.query

        try {
            const products = await productsConnection('products')
            .join('desc', 'desc.product_id', '=', 'products.id')
            .join('price', 'price.product_id', '=', 'products.id')
            .join('rate', 'rate.product_id', '=', 'products.id')
            .where('desc.type', '=', String(type))
            .select(
                'products.id',
                'products.url',
                'products.filename',
                'products.registered_at',

                'desc.title',
                'desc.desc',
                'desc.time',
                'desc.registered_at',
                
                'price.price',
                'price.label',
    
                'rate.rate'
                )

                return response.status(200).json(products)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async indexOfCategory(request: Request, response: Response) {
        const { type, category } = request.query

        try {
            const products = await productsConnection('products')
            .join('desc', 'desc.product_id', '=', 'products.id')
            .join('price', 'price.product_id', '=', 'products.id')
            .join('rate', 'rate.product_id', '=', 'products.id')
            .where('desc.type', '=', String(type))
            .where('desc.category', '=', String(category))
            .select(
                'products.id',
                'products.url',
                'products.filename',
                'products.registered_at',

                'desc.title',
                'desc.desc',
                'desc.time',
                'desc.registered_at',
                
                'price.price',
                'price.label',
    
                'rate.rate'
                )

                return response.status(200).json(products)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async bests(request: Request, response: Response) {
        const {type} = request.query
        
        try {
            const bestsProducts = await productsConnection('products')
            .join('desc', 'desc.product_id', '=', 'products.id')
            .join('price', 'price.product_id', '=', 'products.id')
            .join('rate', 'rate.product_id', '=', 'products.id')
            .where('desc.type', '=', String(type))
            .max('rate.rate')
            .select(
                'products.id',
                'products.url',
                'products.filename',
                'products.registered_at',

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
            const products = await productsConnection('products')
        .join('desc', 'desc.product_id', '=', 'products.id')
        .join('price', 'price.product_id', '=', 'products.id')
        .join('rate', 'rate.product_id', '=', 'products.id')
        .where('desc.type', '=', String(type))
        .orWhere('desc.title', 'like', `%${String(search)}%`)
        .orWhere('desc.desc', 'like', `%${String(search)}%`)
        .select(
            'products.id',
            'products.url',
            'products.filename',
            'products.registered_at',

            'desc.title',
            'desc.desc',
            'desc.time',
            'desc.registered_at',
            
            'price.price',
            'price.label',

            'rate.rate'
            )
            return response.status(200).json(products)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})            
        }
    }
    async create(request: Request, response: Response) {
        // Time in seconds
        const { size, key: filename, location: url="" } = request.file
        const { type, category, title, desc, prices }: CreateContentProps = request.body
        
        const trx = await productsConnection.transaction()

        try {
            
            const [registerProduct] = await trx('products')
            .insert({
                size,
                filename,
                url
                }
            )
            
            const pricesRef = prices.map(price => { 
                return {...price, 'product_id': 0}
            })

        await trx('desc')
            .insert({
                type,
                category,
                title,
                desc,
                'product_id': 0
            })
        await trx('price')
            .insert(pricesRef)

            trx.commit()
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