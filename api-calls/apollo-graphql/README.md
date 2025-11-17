# Apollo GraphQL Examples

Comprehensive examples demonstrating Apollo Client for React from beginner to advanced concepts.

## 🎯 What is Apollo Client?

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. It's a complete data platform with intelligent caching, optimistic UI, and powerful developer tools.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## 📚 Examples Included

### Beginner Level

#### 1. Basic Query
**File:** `src/beginner/01-BasicQuery.jsx`

GraphQL fundamentals:
- Using `useQuery` hook
- GraphQL query syntax
- Handling loading and errors
- Automatic caching

```javascript
const { loading, error, data } = useQuery(GET_USERS);
```

```graphql
query GetUsers {
  users {
    id
    name
    email
    role
  }
}
```

#### 2. Query with Variables
**File:** `src/beginner/02-QueryWithVariables.jsx`

Dynamic GraphQL queries:
- Passing variables to queries
- Using `skip` option
- Type-safe variables
- Separate caching per variable

```javascript
const { data } = useQuery(GET_USER, {
  variables: { id: userId },
  skip: !userId,
});
```

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

#### 3. Refetching Data
**File:** `src/beginner/03-RefetchingData.jsx`

Keep data synchronized:
- Manual refetch
- Network status tracking
- Fetch policies
- Understanding cache vs network

```javascript
const { data, refetch, networkStatus } = useQuery(GET_USERS, {
  notifyOnNetworkStatusChange: true,
  fetchPolicy: 'cache-and-network',
});
```

**Fetch Policies:**
- `cache-first` - Default, return cache first
- `cache-and-network` - Return cache, then fetch
- `network-only` - Always fetch, bypass cache
- `no-cache` - Fetch and don't cache
- `cache-only` - Only use cache

### Intermediate Level

#### 4. Mutations
**File:** `src/intermediate/01-Mutations.jsx`

Modifying data:
- Using `useMutation` hook
- GraphQL mutations
- Refetching after mutations
- Mutation states

```javascript
const [createUser, { loading, error }] = useMutation(CREATE_USER, {
  refetchQueries: [{ query: GET_USERS }],
  onCompleted: (data) => {
    console.log('User created:', data);
  },
});
```

```graphql
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
    email
  }
}
```

#### 5. Pagination
**File:** `src/intermediate/02-Pagination.jsx`

Page through results:
- Pagination with variables
- Using `previousData` for smooth UX
- Total counts and page info

```javascript
const { data, previousData } = useQuery(GET_POSTS, {
  variables: { page, limit },
});

const displayData = data || previousData;
```

#### 6. Local State Management
**File:** `src/intermediate/03-LocalState.jsx`

Client-side state:
- Reactive variables
- `makeVar()` and `useReactiveVar()`
- `@client` directive
- Mixing local and remote data

```javascript
export const themeVar = makeVar('light');

function Component() {
  const theme = useReactiveVar(themeVar);

  return (
    <button onClick={() => themeVar('dark')}>
      Switch to dark
    </button>
  );
}
```

### Advanced Level

#### 7. Optimistic UI
**File:** `src/advanced/01-OptimisticUI.jsx`

Instant updates:
- Optimistic responses
- Manual cache updates
- `update` function
- Automatic rollback on error

```javascript
const [likePost] = useMutation(LIKE_POST, {
  optimisticResponse: {
    __typename: 'Mutation',
    likePost: {
      __typename: 'Post',
      id: postId,
      likes: currentLikes + 1,
    },
  },
  update: (cache, { data: { likePost } }) => {
    cache.modify({
      id: cache.identify(likePost),
      fields: {
        likes: () => likePost.likes,
      },
    });
  },
});
```

#### 8. Cache Manipulation
**File:** `src/advanced/02-CacheManipulation.jsx`

Direct cache control:
- `readQuery()` and `writeQuery()`
- `cache.modify()`
- `cache.evict()`
- Garbage collection

```javascript
// Read from cache
const data = client.readQuery({
  query: GET_USER,
  variables: { id: userId },
});

// Write to cache
client.writeQuery({
  query: GET_USER,
  variables: { id: userId },
  data: { user: newUserData },
});

// Modify specific fields
cache.modify({
  id: cache.identify(user),
  fields: {
    role: () => 'Admin',
  },
});

// Remove from cache
cache.evict({ id: cache.identify(user) });
cache.gc();
```

#### 9. Error Handling
**File:** `src/advanced/03-ErrorHandling.jsx`

Robust error management:
- Error policies
- GraphQL errors vs Network errors
- `onError` callbacks
- Error recovery

```javascript
const { error } = useQuery(GET_USER, {
  variables: { id: '999' },
  errorPolicy: 'all', // none, ignore, all
  onError: (error) => {
    console.error('Query error:', error);
    // Log to error tracking service
  },
});

// Error structure
error.graphQLErrors // Server-side errors
error.networkError // Network issues
error.message // Combined message
```

## 🎨 Features

- **Mock GraphQL Server** - Works locally, no backend needed
- **Complete Schema** - Queries, mutations, and subscriptions defined
- **Type Definitions** - Full GraphQL schema for reference
- **Visual Examples** - Clean UI for each concept
- **Production Patterns** - Real-world code you can use

## 🔑 Key Concepts

### Normalized Cache
Apollo automatically normalizes your cache based on `__typename` and `id`:

```javascript
// This post is cached as Post:1
{
  __typename: 'Post',
  id: '1',
  title: 'Hello',
  author: { __typename: 'User', id: '1', name: 'John' }
}

// And references User:1 which is also cached separately
```

### Cache Policies
Apollo provides fine-grained control:

```javascript
new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        posts: {
          keyArgs: ['page', 'limit'], // These args define uniqueness
        },
      },
    },
  },
})
```

### Automatic Features
- Normalized caching by type and ID
- Automatic cache updates
- Optimistic UI with rollback
- Request deduplication
- Polling and refetching
- Error and loading states

## 📖 Additional Resources

- [Official Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Basics](https://graphql.org/learn/)
- [Apollo DevTools](https://www.apollographql.com/docs/react/development-testing/developer-tooling/)

## 💡 Tips

1. **Install Apollo DevTools** - Chrome extension for cache inspection
2. **Check __typename** - Ensure all objects have __typename for caching
3. **Use fragments** - DRY up your queries with GraphQL fragments
4. **Understand the cache** - Normalized caching is Apollo's superpower

## 🏆 Best Practices

✅ Always include `__typename` in responses
✅ Use meaningful operation names
✅ Implement error boundaries
✅ Use fragments for reusable fields
✅ Configure cache policies for complex queries
✅ Implement optimistic updates for better UX
✅ Handle both GraphQL and network errors

## 🔄 Production Setup

When connecting to a real GraphQL server:

```javascript
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: 'https://your-api.com/graphql',
  headers: {
    authorization: `Bearer ${token}`,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
```

## 🚀 Next Steps

After mastering these examples:
1. Set up authentication with Apollo Link
2. Implement subscriptions for real-time updates
3. Learn about pagination strategies (offset vs cursor)
4. Explore Apollo Client with Next.js SSR
5. Study schema stitching and federation

Happy coding! 🎉
