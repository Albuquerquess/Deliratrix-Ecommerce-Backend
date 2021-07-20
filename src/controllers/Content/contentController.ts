import { Request, Response } from 'express'

import contentConnection from '../../Database/connections/content/contentConnection'

import orderByReferences from '../../utils/orderByReferences'
class ProductController {
    async index(request: Request, response: Response) {
        const { type } = request.query
        
        try {
            const content = await contentConnection('content')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('desc.type', '=', String(type))
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
                .select(
                    'price.label'
                )
                .min('price.price as price')
                
                return response.status(200).json(content)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async show(request: Request, response: Response) {
        const { id } = request.query

        const trx = await contentConnection.transaction()

        try {
            const [content] = await trx('content')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('content.id', '=', String(id))
            .select(
                'content.id',
                'content.url',
                'content.filename',
                'content.registered_at',

                'desc.title',
                'desc.desc',
                'desc.time',
                'desc.type',
                'desc.category',
                'desc.registered_at',

                'rate.rate'
                )
            
            const prices = await trx('price')
                .where('price.content_id', '=', String(id))
                .select('price.label', 'price.price', 'price.id')

            await trx.commit()

                return response.status(200).json({content, prices})
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async indexOfCategory(request: Request, response: Response) {
        const { type, category } = request.query

        try {
            const content = await contentConnection('content')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('desc.type', '=', String(type))
            .where('desc.category', '=', String(category))
            .groupBy('content.id')
            .orderBy('rate.rate', 'asc')
            .select(
                'content.id',
                'content.registered_at',
                'desc.type',
                'desc.category',
                'desc.title',
                'desc.desc'
                )
                .select(
                    'price.label'
                    )
                    .min('price.price as price')

                return response.status(200).json(content)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async bests(request: Request, response: Response) {
        const {type} = request.query
        
        try {
            const bestsProducts = await contentConnection('content')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .where('desc.type', '=', String(type))
            .groupBy('content.id')
            .orderBy('rate.rate', 'asc')
            .limit(3)
            .select(
                'content.id',
                'content.registered_at',
                'content.url',

                'desc.type',
                'desc.category',
                'desc.title',
                'desc.desc',

                'rate.rate',
                'price.label'


                )
                .min('price.price as price')

            return response.status(200).json(bestsProducts)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})
        }
    }
    async search(request: Request, response: Response) {
        const {search, orderBy} = request.query
        console.log(orderBy)
        console.log(orderByReferences[String(orderBy)][0], orderByReferences[String(orderBy)][1])

        try {
            const content = await contentConnection('content')
            .join('price', 'price.content_id', '=', 'content.id')
            .join('desc', 'desc.content_id', '=', 'content.id')
            .join('rate', 'rate.content_id', '=', 'content.id')
            .orWhere('desc.title', 'like', `%${String(search)}%`)
            .orWhere('desc.desc', 'like', `%${String(search)}%`)
            .orWhere('price.price', 'like', `%${String(search)}%`)
            .groupBy('content.id')
            .orderBy(orderByReferences[String(orderBy)][0], orderByReferences[String(orderBy)][1])
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
                .select(
                    'price.label'
                )
                .min('price.price as price')

            return response.status(200).json(content)
        } catch (error) {
            return response.status(500).json({error: true, message: 'Ocorreu um erro, por favor tente novamente', errorMessage: error.message, errorName: error.name})            
        }
    }

}

export default ProductController