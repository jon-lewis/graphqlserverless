const { GraphQLServerLambda } = require("graphql-yoga");
var fs = require("fs")

const typeDefs = fs.readFileSync("./schema.gql").toString('utf-8');

const resolvers = {
    Query: {
        "hello": () => {
            return 'pickles';
        }
    }
};

const lambda = new GraphQLServerLambda({
    typeDefs,
    resolvers
});

exports.server = lambda.graphqlHandler;
exports.playground = lambda.playgroundHandler;
