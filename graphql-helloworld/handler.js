'use strict';

var { graphql, buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };


module.exports.endpoint = (event, context, callback) => {

  graphql(schema, '{ hello }', root).then((response) => {
    const httpResponse = {
      statusCode: 200,
      body: JSON.stringify({
        message: response,
      }),
    };
  
    callback(null, httpResponse);
  });
  
};
