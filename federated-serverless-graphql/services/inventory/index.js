'use strict';

const { ApolloServer, gql } = require("apollo-server-lambda");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  extend type Product @key(fields: "upc") {
    upc: String! @external
    weight: Int @external
    price: Float @external
    inStock: Boolean
    shippingEstimate: Float @requires(fields: "price weight")
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      if(!inventory.find(product => product.upc === object.upc)) {
        return Error("Item not found in inventory");
      };
      return {
        ...object,
        ...inventory.find(product => product.upc === object.upc)
      };
    },
    shippingEstimate(object) {
      // free for expensive items
      if (object.price > 1000) return 0;
      // estimate is based on weight
      return object.weight * 0.5;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

exports.graphqlHandler = server.createHandler();

const inventory = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true },
  { upc: "35423535-2345234523-45243-52345234-545", inStock: true }
];
