// const typeDefs = gql`
//   type Query {
//     hello: String!
//     noOfAnimals: Int
//     price: Float
//     isCool: Boolean
//   }
// `;
/*to avoid  null values */
const { gql } = require("apollo-server");

exports.typeDefs = gql`
  type Query {
    hello: String
    products(filter: ProductInputFilter): [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
  }
  type Mutation {
    addCategories(input: AddCategoryInput!): Category!
    addProduct(input: AddProductInput!): Product!
    addReview(input: AddReviewInput!): Review!
    deleteCategory(id: ID!): Boolean!
    deleteProduct(id: ID!): Boolean!
    deleteReview(id: ID!): Boolean!
    updateCategory(id: ID!, input: UpdateInputCategory): Category
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    updateReview(id: ID!, input: UpdateReviewInput!): Review
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    category: Category
    reviews: [Review!]!
  }

  type Category {
    id: ID!
    name: String!
    products(filter: ProductInputFilter): [Product!]!
  }

  type Review {
    id: ID!
    date: String!
    title: String!
    comment: String!
    rating: Int!
  }

  input ProductInputFilter {
    onSale: Boolean!
    avgRating: Int
  }

  input AddCategoryInput {
    name: String!
  }

  input UpdateInputCategory {
    name: String!
  }

  input AddProductInput {
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    categoryId: String!
  }

  input UpdateProductInput {
    name: String!
    description: String!
    quantity: Int!
    image: String!
    price: Float!
    onSale: Boolean!
    categoryId: String!
  }

  input AddReviewInput {
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productId: String!
  }

  input UpdateReviewInput {
    date: String!
    title: String!
    comment: String!
    rating: Int!
    productId: String!
  }
`;
