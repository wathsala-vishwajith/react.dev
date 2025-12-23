import { gql } from '@apollo/client';

// User Mutations
export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!, $role: String!) {
    createUser(name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $role: String) {
    updateUser(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

// Post Mutations
export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!, $authorId: ID!) {
    createPost(title: $title, body: $body, authorId: $authorId) {
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

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $body: String) {
    updatePost(id: $id, title: $title, body: $body) {
      id
      title
      body
      likes
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      title
      likes
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;
