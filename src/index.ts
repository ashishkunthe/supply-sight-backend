// src/index.ts
import { ApolloServer, gql } from "apollo-server";
import { typeDefs as schemaTypeDefs } from "./schema.js";
import { resolvers } from "./resolver.js";

const server = new ApolloServer({
  typeDefs: schemaTypeDefs,
  resolvers,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 GraphQL Server ready at ${url}`);
});
