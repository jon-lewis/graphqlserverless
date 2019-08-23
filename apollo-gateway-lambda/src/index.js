import { ApolloServer } from 'apollo-server-lambda';
import { ApolloGateway } from '@apollo/gateway';
import { formatError } from 'apollo-errors';

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4001/" },
    { name: "reviews", url: "http://localhost:4002/" },
    { name: "products", url: "http://localhost:4003/" },
    { name: "inventory", url: "http://localhost:4004/" }
  ]
});

const createHandler = async () => {
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    executor,
    formatError,
    introspection: true,
    playground: true,
    context: ({ event, context }) => ({
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    }),
  });
  // eslint-disable-next-line no-return-await
  return server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
      methods: 'GET, POST',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
  });
};

// eslint-disable-next-line import/prefer-default-export
export const graphqlHandler = (event, context, callback) => {
  createHandler().then(handler => handler(event, context, callback));
};
