import Hapi from 'hapi'

import database from './config/database'
import userRoute from './routes/userRoute'
import postRoute from './routes/postRoute'

const port = 3000

// Hapi.server cria uma constante server para receber as requisições
const server = Hapi.server({
    host: 'localhost',
    port,
    routes: {
        json: {
            space: 4
        }
    }
})

userRoute(server)
postRoute(server)

server.route({
    method: 'GET',
    path: '/',
    handler: () => 'Hello World from Hapi!'
})

database.connect().then(async () => {

    try {
        await server.start()
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
    
    console.log('Server running at:', server.info.uri);
})