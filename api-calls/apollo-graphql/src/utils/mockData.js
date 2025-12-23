// Mock data for GraphQL examples
// In a real app, this would come from your GraphQL server

export const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', __typename: 'User' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', __typename: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', __typename: 'User' },
  { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Moderator', __typename: 'User' },
  { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', __typename: 'User' },
];

export const posts = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  title: `Post ${i + 1}`,
  body: `This is the content of post ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  likes: Math.floor(Math.random() * 100),
  author: users[(i % 5)],
  __typename: 'Post',
}));

export const comments = Array.from({ length: 200 }, (_, i) => ({
  id: String(i + 1),
  postId: String(Math.floor(i / 4) + 1),
  text: `Comment ${i + 1} text - this is a thoughtful comment about the post.`,
  author: users[i % 5].name,
  __typename: 'Comment',
}));

// Helper to get posts with pagination
export const getPaginatedPosts = (page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    posts: posts.slice(start, end),
    total: posts.length,
    page,
    hasMore: end < posts.length,
    __typename: 'PostConnection',
  };
};

// Helper to get comments for a post
export const getCommentsForPost = (postId) => {
  return comments.filter(c => c.postId === postId);
};

// Helper to search posts
export const searchPosts = (query) => {
  return posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.body.toLowerCase().includes(query.toLowerCase())
  );
};
