# TanStack Query (React Query) Examples

Comprehensive examples demonstrating TanStack Query (React Query) from beginner to advanced concepts.

## 🎯 What is TanStack Query?

TanStack Query is a powerful data synchronization library for React that makes fetching, caching, synchronizing and updating server state a breeze. It works with any async data source (REST, GraphQL, or anything that returns a promise).

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

Learn the fundamentals:
- Using `useQuery` hook
- Handling loading states
- Handling errors
- Automatic caching

```javascript
const { data, isLoading, isError, error } = useQuery({
  queryKey: ['users'],
  queryFn: api.getUsers,
});
```

#### 2. Query with Parameters
**File:** `src/beginner/02-QueryWithParams.jsx`

Dynamic queries:
- Passing parameters to queries
- Including params in queryKey
- Conditionally enabling queries
- Caching per parameter

```javascript
const { data } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => api.getUser(userId),
  enabled: !!userId,
});
```

#### 3. Refetching Data
**File:** `src/beginner/03-RefetchingData.jsx`

Keep data fresh:
- Manual refetch with `refetch()`
- Automatic refetch on window focus
- Stale time configuration
- Difference between `isLoading` and `isFetching`

```javascript
const { data, refetch, isFetching } = useQuery({
  queryKey: ['users'],
  queryFn: api.getUsers,
  refetchOnWindowFocus: true,
  staleTime: 5000,
});
```

### Intermediate Level

#### 4. Mutations
**File:** `src/intermediate/01-Mutations.jsx`

Create, update, delete:
- Using `useMutation` hook
- Invalidating queries after mutations
- Handling mutation states
- `onSuccess` callbacks

```javascript
const mutation = useMutation({
  mutationFn: api.createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});
```

#### 5. Pagination
**File:** `src/intermediate/02-Pagination.jsx`

Page through data:
- Page-based pagination
- Keeping previous data while loading
- Calculating total pages
- Page navigation

```javascript
const { data } = useQuery({
  queryKey: ['posts', page],
  queryFn: () => api.getPosts({ page, limit }),
  placeholderData: (previousData) => previousData,
});
```

#### 6. Dependent Queries
**File:** `src/intermediate/03-DependentQueries.jsx`

Chained data fetching:
- Queries that depend on other queries
- Using `enabled` to control execution
- Loading states for dependent queries
- Fetching related data

```javascript
const postQuery = useQuery({
  queryKey: ['post', postId],
  queryFn: () => api.getPost(postId),
  enabled: !!postId,
});

const authorQuery = useQuery({
  queryKey: ['user', postQuery.data?.userId],
  queryFn: () => api.getUser(postQuery.data.userId),
  enabled: !!postQuery.data?.userId,
});
```

### Advanced Level

#### 7. Optimistic Updates
**File:** `src/advanced/01-OptimisticUpdates.jsx`

Instant UI updates:
- Update UI before server responds
- Roll back on error
- `onMutate`, `onError`, `onSettled` callbacks
- Manual cache updates

```javascript
const mutation = useMutation({
  mutationFn: api.likePost,
  onMutate: async (postId) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    const previousPosts = queryClient.getQueryData(['posts']);

    queryClient.setQueryData(['posts'], (old) => {
      // Optimistically update cache
      return updatePosts(old, postId);
    });

    return { previousPosts };
  },
  onError: (err, postId, context) => {
    // Rollback on error
    queryClient.setQueryData(['posts'], context.previousPosts);
  },
});
```

#### 8. Infinite Queries
**File:** `src/advanced/02-InfiniteQueries.jsx`

Infinite scrolling:
- `useInfiniteQuery` hook
- Page parameters and cursors
- `fetchNextPage()` function
- `hasNextPage` detection

```javascript
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => api.getInfinitePosts({ pageParam }),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

#### 9. Prefetching & Advanced Caching
**File:** `src/advanced/03-PrefetchingAndCaching.jsx`

Performance optimization:
- Prefetch data before needed
- Configure stale time and cache time
- Smart preloading on hover
- Cache inspection

```javascript
// Prefetch on hover
queryClient.prefetchQuery({
  queryKey: ['user', userId],
  queryFn: () => api.getUser(userId),
  staleTime: 2 * 60 * 1000,
});

// Configure cache behavior
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: api.getUsers,
  staleTime: 5 * 60 * 1000, // Fresh for 5 minutes
  gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
});
```

## 🎨 Features

- **React Query DevTools** - Built-in devtools for debugging
- **Mock API** - No backend needed, all examples work locally
- **Well-commented code** - Every example has detailed explanations
- **Visual UI** - Clean, modern interface for each example
- **Real-world patterns** - Production-ready code

## 🔑 Key Concepts

### Query Keys
Unique identifiers for queries. Include all variables:
```javascript
['users'] // All users
['user', 1] // User with ID 1
['posts', { page: 1, limit: 10 }] // Posts page 1
```

### Stale Time vs Cache Time
- **staleTime**: How long data is considered fresh (won't refetch)
- **gcTime** (formerly cacheTime): How long unused data stays in memory

### Automatic Features
- Automatic caching
- Automatic refetching on window focus
- Automatic retry on error
- Automatic garbage collection
- Deduplication of requests

## 📖 Additional Resources

- [Official Documentation](https://tanstack.com/query/latest)
- [API Reference](https://tanstack.com/query/latest/docs/react/reference/useQuery)
- [Community Examples](https://tanstack.com/query/latest/docs/react/examples/react/simple)

## 💡 Tips

1. **Use the DevTools** - Press the floating icon to open React Query DevTools
2. **Check the Network tab** - See how queries are cached and deduplicated
3. **Experiment** - Try changing staleTime, gcTime, and other options
4. **Read the code** - Each example has detailed inline comments

## 🏆 Best Practices

✅ Always include all variables in queryKey
✅ Use meaningful query keys
✅ Configure staleTime based on data freshness needs
✅ Use placeholderData for better UX during pagination
✅ Implement optimistic updates for better perceived performance
✅ Prefetch data when user intent is clear (hover, navigation)

## 🚀 Next Steps

After mastering these examples:
1. Implement these patterns in your own app
2. Explore server-side rendering with TanStack Query
3. Learn about query synchronization across tabs
4. Study advanced patterns like infinite scroll with cursor pagination

Happy coding! 🎉
