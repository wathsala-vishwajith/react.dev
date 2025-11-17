import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '../graphql/schema';
import { users, posts, comments, getPaginatedPosts, getCommentsForPost, searchPosts } from './mockData';

// Mock resolvers - simulates a GraphQL server
// In a real app, you would use HttpLink to connect to your GraphQL server
const resolvers = {
  Query: {
    users: () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...users]), 500);
      });
    },
    user: (_, { id }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = users.find(u => u.id === id);
          if (user) resolve(user);
          else reject(new Error('User not found'));
        }, 500);
      });
    },
    posts: (_, { page = 1, limit = 10 }) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(getPaginatedPosts(page, limit)), 800);
      });
    },
    post: (_, { id }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const post = posts.find(p => p.id === id);
          if (post) resolve(post);
          else reject(new Error('Post not found'));
        }, 500);
      });
    },
    comments: (_, { postId }) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(getCommentsForPost(postId)), 600);
      });
    },
    searchPosts: (_, { query }) => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(searchPosts(query)), 700);
      });
    },
  },
  Mutation: {
    createUser: (_, { name, email, role }) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newUser = {
            id: String(users.length + 1),
            name,
            email,
            role,
            __typename: 'User',
          };
          users.push(newUser);
          resolve(newUser);
        }, 800);
      });
    },
    updateUser: (_, { id, name, email, role }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = users.find(u => u.id === id);
          if (user) {
            if (name !== undefined) user.name = name;
            if (email !== undefined) user.email = email;
            if (role !== undefined) user.role = role;
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        }, 700);
      });
    },
    deleteUser: (_, { id }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = users.findIndex(u => u.id === id);
          if (index !== -1) {
            users.splice(index, 1);
            resolve({ success: true, message: 'User deleted', __typename: 'DeleteResponse' });
          } else {
            reject(new Error('User not found'));
          }
        }, 600);
      });
    },
    createPost: (_, { title, body, authorId }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const author = users.find(u => u.id === authorId);
          if (!author) {
            reject(new Error('Author not found'));
            return;
          }
          const newPost = {
            id: String(posts.length + 1),
            title,
            body,
            likes: 0,
            author,
            __typename: 'Post',
          };
          posts.unshift(newPost);
          resolve(newPost);
        }, 900);
      });
    },
    updatePost: (_, { id, title, body }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const post = posts.find(p => p.id === id);
          if (post) {
            if (title !== undefined) post.title = title;
            if (body !== undefined) post.body = body;
            resolve(post);
          } else {
            reject(new Error('Post not found'));
          }
        }, 700);
      });
    },
    likePost: (_, { id }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const post = posts.find(p => p.id === id);
          if (post) {
            post.likes += 1;
            resolve(post);
          } else {
            reject(new Error('Post not found'));
          }
        }, 300);
      });
    },
    deletePost: (_, { id }) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = posts.findIndex(p => p.id === id);
          if (index !== -1) {
            posts.splice(index, 1);
            resolve({ success: true, message: 'Post deleted', __typename: 'DeleteResponse' });
          } else {
            reject(new Error('Post not found'));
          }
        }, 600);
      });
    },
  },
  User: {
    posts: (user) => {
      return posts.filter(p => p.author.id === user.id);
    },
  },
  Post: {
    comments: (post) => {
      return getCommentsForPost(post.id);
    },
  },
};

// Create executable schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Create Apollo Client with SchemaLink for local testing
// In production, replace SchemaLink with HttpLink pointing to your GraphQL server
export const createApolloClient = () => {
  return new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: ['page', 'limit'],
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
};

// For production use with a real GraphQL server:
// import { HttpLink } from '@apollo/client';
//
// const httpLink = new HttpLink({
//   uri: 'https://your-graphql-api.com/graphql',
// });
//
// export const createApolloClient = () => {
//   return new ApolloClient({
//     link: httpLink,
//     cache: new InMemoryCache(),
//   });
// };
