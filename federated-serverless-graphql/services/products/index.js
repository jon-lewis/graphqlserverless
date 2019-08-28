'use strict';

const { ApolloServer, gql } = require("apollo-server-lambda");
const { buildFederatedSchema } = require("@apollo/federation");

global.btoa = function (str) {return new Buffer(str).toString('base64');};
global.atob = function (str) {return Buffer.from(str, 'base64').toString();};

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
    productsConnection(first: Int = 10, after: String): ProductConnection
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Float
    weight: Int
  }

  type ProductConnection {
    totalCount: Int
    edges: [ProductEdge]
    pageInfo: ConnectionPageInfo
  }

  type ProductEdge {
    cursor: String!
    node: Product!
  }

  type ConnectionPageInfo {
    endCursor: String!
    hasNextPage: Boolean
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    },
    productsConnection(_, args) {
      // get our dataset
      var start = products.findIndex(p => p.upc === atob(args.after || ''));
      // cursor was not found in the dataset
      if(start === -1) start = 0;
      var nodes = products.slice(start, args.first);

      // build edges
      var edges = [];
      nodes.forEach(n => {
        edges.push({
          node:   n,
          cursor: btoa(n.upc) // Encode the id of our object so the client doesn't rely on the implementation of how we do the cursor so we can easily change it in the future without affecting clients.
        });
      });

      return {
        totalCount: products.length,
        edges: edges,
        pageInfo: {
          endCursor: btoa(products[products.length-1].upc),
          hasNextPage: products[products.length-1] !== edges[edges.length-1].node
        }
      };
    }
    // Mock
    // productsConnection(_, args) {
    //   return {
    //     totalCount: 1,
    //     edges: [
    //       {
    //         node: {"upc":1,"name":"Sierra Lessingia","price":25.29,"weight":59},
    //         cursor: "1"
    //       }
    //     ],
    //     pageInfo: {
    //       endCursor: "1",
    //       hasNextPage: false
    //     }
    //   };
    // }
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

const products = [
  {
  "upc": "059d89a5-1eb9-4efc-ba4f-d1e9f12c9209",
  "name": "Leafy Desertdandelion",
  "price": 60.68,
  "weight": 20
}, {
  "upc": "812d5d9a-1d8a-4dc3-a7b1-07194240e56d",
  "name": "Bryonora Lichen",
  "price": 54.34,
  "weight": 2
}, {
  "upc": "e0490b63-8265-426c-b91c-2e9c102f43c2",
  "name": "Rigid Whitetop Aster",
  "price": 73.15,
  "weight": 90
}, {
  "upc": "d47faa18-ae52-4bcc-8ddf-bf9dfc8df675",
  "name": "Leiberg's Bluegrass",
  "price": 19.37,
  "weight": 76
}, {
  "upc": "47e7a1cf-d2ff-4446-b774-2b01f4d2ecef",
  "name": "Naupaka",
  "price": 88.41,
  "weight": 73
}, {
  "upc": "b972c1a2-5456-4444-8694-d7e7c7689462",
  "name": "Wright's Wirelettuce",
  "price": 93.52,
  "weight": 28
}, {
  "upc": "2c589942-e3c8-4e3e-9ccf-b8f5c2a2bf58",
  "name": "Alpine Fescue",
  "price": 99.62,
  "weight": 27
}, {
  "upc": "751a6962-464c-4b35-b9e0-d7a50155f8f5",
  "name": "Scrub Balm",
  "price": 64.89,
  "weight": 93
}, {
  "upc": "e11bc784-0e4e-40ad-9cee-8c32a0ded9a4",
  "name": "Breadfruit",
  "price": 52.93,
  "weight": 44
}, {
  "upc": "c26bdb8d-83de-432c-977c-cb8f7588362a",
  "name": "Lespedeza",
  "price": 45.19,
  "weight": 25
}, {
  "upc": "9132c89c-6566-4e05-9db4-eb79c37d58ab",
  "name": "Red Bulrush",
  "price": 95.27,
  "weight": 43
}, {
  "upc": "a7043cfe-778a-462e-b899-2c1ed4fc5fd9",
  "name": "Mediterranean Barley",
  "price": 48.45,
  "weight": 43
}, {
  "upc": "d274b5d3-e24a-4011-9f28-69b0d3db1662",
  "name": "Rio Grande Skullcap",
  "price": 38.33,
  "weight": 94
}, {
  "upc": "1563e386-322e-49ba-9620-fc1ef4d23c06",
  "name": "Sea Lettuce",
  "price": 84.35,
  "weight": 17
}, {
  "upc": "c708246d-df4d-4b75-bef2-1ad1c4169a5c",
  "name": "Hedgemustard",
  "price": 33.12,
  "weight": 40
}, {
  "upc": "32ccaa34-702c-4bcd-ae2b-5ce80b4fc8a3",
  "name": "Scaleleaf False Foxglove",
  "price": 4.02,
  "weight": 40
}, {
  "upc": "4c085d8e-1884-4fc8-af87-19407edc344c",
  "name": "Skin Lichen",
  "price": 41.01,
  "weight": 64
}, {
  "upc": "d65bf375-5583-4961-a256-7d79c666dfa9",
  "name": "West Indian Tonguefern",
  "price": 92.94,
  "weight": 37
}, {
  "upc": "549ad51c-e32a-41fe-ac22-ac2b55ff2755",
  "name": "Carrotwood",
  "price": 94.42,
  "weight": 100
}, {
  "upc": "5d61d3e3-f44c-473f-b8ff-cd53087057ef",
  "name": "Stemless Dwarf-cudweed",
  "price": 19.95,
  "weight": 1
}, {
  "upc": "c6917058-82b9-4957-9936-a1fb5553c3d4",
  "name": "Everglades Key False Buttonweed",
  "price": 69.46,
  "weight": 64
}, {
  "upc": "ff73de10-a515-4f57-9585-149a1044b0fd",
  "name": "Sierra Rush",
  "price": 29.7,
  "weight": 96
}, {
  "upc": "6ab0c9b5-9e1a-454f-837b-9fba81806607",
  "name": "Tickseed",
  "price": 79.86,
  "weight": 39
}, {
  "upc": "58081239-5c26-4b50-ba16-e0b0e1af62a8",
  "name": "Spoon Pondweed",
  "price": 22.05,
  "weight": 63
}, {
  "upc": "a4bbe75b-29e7-46a8-b610-2ad1c964c65a",
  "name": "Woodfern",
  "price": 22.24,
  "weight": 70
}, {
  "upc": "aa4e493c-8d0d-4a66-abaa-a7e4bcd1a712",
  "name": "Perennial Rockcress",
  "price": 67.63,
  "weight": 69
}, {
  "upc": "c744daa4-9b5e-44ad-a9fa-2b4a35e5ed85",
  "name": "Rubber Rabbitbrush",
  "price": 92.45,
  "weight": 14
}, {
  "upc": "0c010a19-36e2-43e6-9256-b729efb6cd96",
  "name": "Australian Cheesewood",
  "price": 88.71,
  "weight": 78
}, {
  "upc": "d20c632d-d237-4fb4-8ef6-1d8c777ab62e",
  "name": "Spotted Joe Pye Weed",
  "price": 41.19,
  "weight": 85
}, {
  "upc": "3afe95eb-9ae3-4fda-b008-458de1e40ac0",
  "name": "Lecidea Lichen",
  "price": 65.68,
  "weight": 88
}, {
  "upc": "2ea81cb2-3c0f-4520-b89a-5be9b4509bde",
  "name": "Saber Bogmat",
  "price": 23.07,
  "weight": 28
}, {
  "upc": "6673f8b2-2951-42c9-aa4e-dd4a9941e899",
  "name": "Guatemalan Fir",
  "price": 2.65,
  "weight": 17
}, {
  "upc": "b37c3b13-d5b8-4204-a3b8-2cce1d5d27d2",
  "name": "Krapovickasia",
  "price": 23.19,
  "weight": 9
}, {
  "upc": "db20ac44-317b-4c07-bc69-1611c725c0a2",
  "name": "Contorted Skin Lichen",
  "price": 81.63,
  "weight": 46
}, {
  "upc": "bd59e5fd-a61c-407c-a8ae-28c147b9ec61",
  "name": "Dot Lichen",
  "price": 26.86,
  "weight": 75
}, {
  "upc": "cdd15cbc-cba4-416d-9a55-003463425fb6",
  "name": "Largeflower Yellow False Foxglove",
  "price": 29.82,
  "weight": 62
}, {
  "upc": "618384b9-f141-4038-8dcb-85f1f68b27a0",
  "name": "Chavar",
  "price": 39.47,
  "weight": 57
}, {
  "upc": "05e26965-3a03-4a0f-aea1-9a70a32159f4",
  "name": "Parish's Broomrape",
  "price": 37.71,
  "weight": 9
}, {
  "upc": "a7218bb9-87f7-43fa-b05f-9a0579c4dfd4",
  "name": "Emory's Acacia",
  "price": 79.17,
  "weight": 96
}, {
  "upc": "5a9b846c-1586-43f6-b02e-fcdab6ce404c",
  "name": "Anthony Peak Lupine",
  "price": 94.49,
  "weight": 6
}, {
  "upc": "d9930b3a-600d-4c62-bf26-d867a17683f2",
  "name": "Toothed Latticevein Fern",
  "price": 85.22,
  "weight": 21
}, {
  "upc": "582dcbb8-7300-4462-9b65-935fa6c5bce3",
  "name": "Eisen's Phacelia",
  "price": 2.54,
  "weight": 63
}, {
  "upc": "1ed354c1-a154-45f3-86a9-749c141216b6",
  "name": "Star Sedge",
  "price": 69.22,
  "weight": 98
}, {
  "upc": "e5219789-4b77-4a36-8e32-941b03b0c821",
  "name": "Drug Fumitory",
  "price": 3.27,
  "weight": 70
}, {
  "upc": "296ec94a-7bdf-4f31-b37d-abae7a74c7f9",
  "name": "Perplexed Beard Lichen",
  "price": 65.41,
  "weight": 3
}, {
  "upc": "7795c23f-c8c9-482f-9ef6-997c6afc1b54",
  "name": "Asphodelus",
  "price": 19.95,
  "weight": 23
}, {
  "upc": "e223b525-c133-449c-9928-e6c2c9bbda5b",
  "name": "Shortstalk False Bindweed",
  "price": 73.02,
  "weight": 67
}, {
  "upc": "0378b889-45a9-40fa-ad44-c082005e13b2",
  "name": "Olympic Violet",
  "price": 12.89,
  "weight": 39
}, {
  "upc": "941061ff-1d1a-4440-909e-9c89ce208a3c",
  "name": "Violetflower Petunia",
  "price": 29.21,
  "weight": 35
}, {
  "upc": "565b186f-a80e-4b19-8d87-7856ffd3f6bb",
  "name": "Rainier Violet",
  "price": 3.16,
  "weight": 86
}];