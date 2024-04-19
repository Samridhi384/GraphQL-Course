import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    me: User
    posts: [Post!]!
    profile(userId: ID!): Profile
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayLoad!
    postUpdate(postId: ID!, post: PostInput!): PostPayLoad!
    postPublish(postId: ID!): PostPayLoad!
    postUnPublish(postId: ID!): PostPayLoad!
    postDelete(postId: ID!): PostPayLoad!
    signup(
      credentials: credentialsInput!
      name: String!
      bio: String!
    ): AuthPayLoad!
    signin(credentials: credentialsInput!): AuthPayLoad!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    isMyProfile: Boolean!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayLoad {
    userErrors: [UserError!]!
    post: Post
  }

  type AuthPayLoad {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input credentialsInput {
    email: String!
    password: String!
  }
`;
