const { ApolloServer } = require("apollo-server");
const { typeDefs } = require("./schema");
const { Query } = require("./resolvers/Query");
const { Category } = require("./resolvers/Category");
const { Product } = require("./resolvers/Products");
const { db } = require("./db");
const { Mutation } = require("./resolvers/Mutation");

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Category,
    Product,
    Mutation,
  },
  context: {
    db,
  },
});

server.listen().then(({ url }) => console.log(url));
