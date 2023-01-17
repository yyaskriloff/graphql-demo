export function feed(parent, args, context) {
    return context.prisma.link.findMany()
}

export function link(parent, { id }, context) {
    return context.prisma.link.findUnique({ where: { id } })
}