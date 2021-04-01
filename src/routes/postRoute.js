// biblioteca de validações Joi que é compatível com o Hapi
import Joi from 'joi'
import { Schema } from 'mongoose'

import PostsController from '../controllers/posts'
import PostModel from '../models/posts'

const postsController = new PostsController(PostModel)

// o argumento server recebe um objeto Hapi
const postRoute = (server) => {

    //server.route configura uma rota
    server.route({
        method: 'GET', // método da requisição
        path: '/posts/{id?}', // caminho da requisição, no Hapi os parêmtros são definidos entre chaves, usar ? para definir que é opcional
        handler: (request, h) => postsController.find(request, h) // handler define a função que será executada ao enviar a requisição
    })

    server.route({
        method: 'POST',
        path: '/posts',
        handler: (request, h) => postsController.create(request, h),
        options: {
            validate: {
                payload: {
                    title: Joi.string().required(),
                    content: Joi.string().required(),
                    author: Joi.string().required()
                }
            }
        } // options define diversas opções, aqui estamos validando os dados com a biblioteca Joi
    })

    server.route({
        method: 'PUT',
        path: '/posts/{id}',
        handler: (request, h) => postsController.update(request, h),
        options: {
            validate: {
                payload: {
                    title: Joi.string(),
                    content: Joi.string(),
                    author: Joi.string().required()
                }
            }
        }
    })

    server.route({
        method: 'DELETE',
        path: '/posts/{id}',
        handler: (request, h) => postsController.delete(request, h)
    })
}

module.exports = postRoute
