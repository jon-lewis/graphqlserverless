const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");
const fs = require('fs');


// Instead of doing the servicelist it is recommended to turn off introspection
// which calls all services for their schema and stitches it all together in one
// giant schema.
//
// So, the recommended way of doing this is to use a schema registry:
// https://www.apollographql.com/docs/graph-manager/schema-registry/
//
// I guess that is a managed service sold by Apollo :(

// We could now put a services.json into a repo somewhere and git clone it into the docker image through the docker build process
const gateway = new ApolloGateway({
  serviceList: JSON.parse(fs.readFileSync('services.json', 'utf8'))
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
