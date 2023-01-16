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
        link: (parent, { id }, context) => context.prisma.link.findUnique({
            where: { id: id }
        })
    },
    Mutation: {
        post: (parent, args, context, info) => {
            const newLink = context.prisma.link.create({
                data: {
                    url: args.url,
                description: args.description,
                },
            })
            return newLink
        },
        updateLink: (parent, args) => {
            let link = links.filter(link => link.id === args.id)
            const index = links.indexOf(link[0])
            link = { ...link[0], ...args }
            links[index] = link
            return link
        },
        deleteLink: (parent, args) => {
            let link = links.filter(link => link.id === args.id)
            if (!link[0]) return null
            link = links.shift(link[0])
            return link
        }
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
