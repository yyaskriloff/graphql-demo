import { ApolloServer } from 'apollo-server'
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import fs from 'fs'
import path from 'path'
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: async (parent, args, context) => context.prisma.link.findMany(),
        link: (parent, { id }, context) => context.prisma.link.findUnique({ where: { id } })
    },
    Mutation: {
        post: async (parent, { url, description }, context, info) => context.prisma.link.create({ data: { url, description } }),
        updateLink: async (parent, args, context) => context.prisma.link.update({ where: { id: args.id }, data: { ...args } }),
        deleteLink: async (parent, { id }, context) => context.prisma.link.delete({ where: { id } })

    },
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync(
        path.join(__dirname, 'schema.graphql'),
        'utf8'
    ),
    resolvers,
    context: {
        prisma,
    }
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
