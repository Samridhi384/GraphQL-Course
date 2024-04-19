const { ApolloServer, gql } = require("apollo-server");

exports.typeDefs = gql`
  type Query {
    cars: [Car!]!
  }
  
    type GroupUdatePayload {
    userErrors: [UserErrors!]!
    group: Group
  }

  type UserErrors {
    message: String!
    field: [String!]!
  }

  input GroupInput {
    name: String
    image: ImageInput
    description: String
    featureSet:GroupFeatureFields
  }

  input ImageInput {
    url: String
  }

    type Mutation {
    groupDelete(groupId: ID!)
    groupPublish(groupId: ID!)
    groupUnpublish(groupId: ID!)
    groupAddCars(groupId: ID!, carId: ID!)
    groupRemoveCars(groupId: ID!, carId: ID!)
    groupCreate(groupInput: GroupInput!)
    groupUpdate(groupId: ID!, groupInput: GroupInput!): Group
  }

  type Car {
    id: ID!
    color: String!
    make: String!
  }

  type Group {
    id: ID!
    featureSet: GroupFeatureSet
    hasCar(id: ID!): Boolean!
    cars(skip: Int!, take: Int!): [Car!]!
    name: String!
    imageId: Image!
    description: String!
  }

  type Image {
    id: ID!
    url: String!
  }

  type GroupFeatureSet {
    features: [GroupFeatures]
    applyFeaturesSeparately: Boolean!
  }

  type GroupFeatures {
    feature: GroupFeatureFields
  }

  enum GroupFeatureFields {
    INCLINE_ENGINE
    FOUR_CYLINDER_ENGINE
    TWIN_CYLUNDER_ENGINE
    RED_PAINT
    BLACK_PAINT
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      cars: () => [{ id: 1, color: "blue", make: "Toyota" }],
    },
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
