import { gql } from '@apollo/client';

// Type Definitions (for reference - not used in Apollo Client directly)
// In a real app, these would be on your GraphQL server

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    likes: Int!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: String!
    post: Post!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts(page: Int, limit: Int): PostConnection!
    post(id: ID!): Post
    comments(postId: ID!): [Comment!]!
    searchPosts(query: String!): [Post!]!
  }

  type PostConnection {
    posts: [Post!]!
    total: Int!
    page: Int!
    hasMore: Boolean!
  }

  type Mutation {
    createUser(name: String!, email: String!, role: String!): User!
    updateUser(id: ID!, name: String, email: String, role: String): User!
    deleteUser(id: ID!): DeleteResponse!

    createPost(title: String!, body: String!, authorId: ID!): Post!
    updatePost(id: ID!, title: String, body: String): Post!
    likePost(id: ID!): Post!
    deletePost(id: ID!): DeleteResponse!
  }

  type DeleteResponse {
    success: Boolean!
    message: String
  }

  type Subscription {
    postLiked: Post!
    postCreated: Post!
  }
`;
