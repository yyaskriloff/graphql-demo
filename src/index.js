import { ApolloServer } from 'apollo-server'
import { PrismaClient } from "@prisma/client"
import fs from 'fs'
const prisma = new PrismaClient()
import path from 'path'
import url from 'url';
import * as Query from './resolvers/Query.js'
import * as Mutation from './resolvers/Mutation.js'
import * as User from './resolvers/User.js'
import * as Link from './resolvers/Link.js'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvers = {
    Query,
    Mutation,
    User,
    Link
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: async ({ req }) => {
        return {
            ...req,
            prisma,
            userId:
                req && req.headers.authorization
                    ? getUserId(req)
                    : null
        };
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
