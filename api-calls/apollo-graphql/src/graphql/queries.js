import { gql } from '@apollo/client';

// User Queries
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
    }
  }
`;

export const GET_USER_WITH_POSTS = gql`
  query GetUserWithPosts($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      posts {
        id
        title
        body
        likes
      }
    }
  }
`;

// Post Queries
export const GET_POSTS = gql`
  query GetPosts($page: Int, $limit: Int) {
    posts(page: $page, limit: $limit) {
      posts {
        id
        title
        body
        likes
        author {
          id
          name
        }
      }
      total
      page
      hasMore
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      body
      likes
      author {
        id
        name
        email
        role
      }
    }
  }
`;

export const GET_POST_WITH_COMMENTS = gql`
  query GetPostWithComments($id: ID!, $postId: ID!) {
    post(id: $id) {
      id
      title
      body
      likes
      author {
        id
        name
        email
      }
    }
    comments(postId: $postId) {
      id
      text
      author
    }
  }
`;

// Search Query
export const SEARCH_POSTS = gql`
  query SearchPosts($query: String!) {
    searchPosts(query: $query) {
      id
      title
      body
      likes
      author {
        id
        name
      }
    }
  }
`;

// Comment Queries
export const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    comments(postId: $postId) {
      id
      text
      author
    }
  }
`;
