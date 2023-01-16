import { ApolloServer } from 'apollo-server'
import fs from 'fs'
import path from 'path'
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let links = [{
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL'
}]

const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        feed: () => links,
        link: (parent, { id }) => links.filter(link => link.id === id)[0]
    },
    Mutation: {
        post: (parent, args) => {

            let idCount = links.length

            const link = {
                id: `link-${idCount++}`,
                description: args.description,
                url: args.url,
            }
            links.push(link)
            return link
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
})

server
    .listen()
    .then(({ url }) =>
        console.log(`Server is running on ${url}`)
    );
