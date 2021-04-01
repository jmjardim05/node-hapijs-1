// importa biblioteca Boom que gera erros de http compatíveis com o Hapi
import Boom from 'boom'

class PostsController {

    constructor(Posts) {
        this.Posts = Posts;
    }

    async find(request) {
        const { id } = request.params
        const query = {} // cria uma query vazia, se não tiver id de parametro busca todos
        let dtCorte = new Date(Math.trunc(Date.now()));
        dtCorte.setDate(-7);

        if (id) {
            query._id = id
        } else {
            query.publishDate = { $gte: dtCorte }
        }

        try {

            const Posts = await this.Posts.find(query, "title content publishDate author")
                                          .populate("author", "firstName lastName")
            return { Posts }
            
        } catch (error) {
            // Boom.metodo_erro envia o erro http de acordo com o método chamado
            return Boom.badRequest('Failed to find user') // envia 400 badrequest com uma msg customizada
        }
    }

    async create(request, h, err) {
        
        try {
            // o corpo da requisição está na propriedade payload de request
            const user = new this.Posts(request.payload)
            await user.save()

            // pelo argumento h acessamos o response da requisição pelo Hapi
            return h.response().code(201) // 201 - Created
        } catch (error) {
            return Boom.badRequest(error)
        }
    }

    async update(request, h) {
        
        const { id } = request.params

        try {
            const updatedUser = await this.Posts.findOneAndUpdate({ _id: id }, request.payload, {
                new: true, // a opção new = true faz retornar o objeto atualizado
            });

            if (updatedUser) {
                return h.response().code(200)
            }

            return Boom.badRequest('Could not update the Posts')

            
        } catch (error) {
            return Boom.badRequest(error)
        }
    }

    async delete(request) {
        // return Boom.notImplemented()  erro para dizer que a requisição ainda não foi implementada

        const { id } = request.params

        try {
            const deletedUser = await this.Posts.findOneAndDelete({ _id: id });

            if (deletedUser) {
                return h.response().code(200)
            }

            return Boom.badRequest('Could not delete the Posts')

            
        } catch (error) {
            return Boom.badRequest(error)
        }
    }
}

export default PostsController