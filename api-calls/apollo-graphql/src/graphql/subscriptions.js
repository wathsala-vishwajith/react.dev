import { gql } from '@apollo/client';

export const POST_LIKED_SUBSCRIPTION = gql`
  subscription OnPostLiked {
    postLiked {
      id
      title
      likes
    }
  }
`;

export const POST_CREATED_SUBSCRIPTION = gql`
  subscription OnPostCreated {
    postCreated {
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
