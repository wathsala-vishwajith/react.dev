// Mock API to simulate real API calls
// In a real app, you'd use fetch or axios to call actual APIs

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Moderator' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
];

const posts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  body: `This is the content of post ${i + 1}. Lorem ipsum dolor sit amet.`,
  userId: (i % 5) + 1,
  likes: Math.floor(Math.random() * 100),
}));

const comments = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  postId: Math.floor(i / 4) + 1,
  text: `Comment ${i + 1} text`,
  author: users[i % 5].name,
}));

// Simulate API error occasionally
const shouldSimulateError = () => Math.random() < 0.1;

export const api = {
  // Users
  getUsers: async () => {
    await delay(800);
    if (shouldSimulateError()) throw new Error('Failed to fetch users');
    return users;
  },

  getUser: async (id) => {
    await delay(500);
    const user = users.find(u => u.id === parseInt(id));
    if (!user) throw new Error('User not found');
    return user;
  },

  createUser: async (userData) => {
    await delay(1000);
    const newUser = {
      id: users.length + 1,
      ...userData,
    };
    users.push(newUser);
    return newUser;
  },

  updateUser: async (id, userData) => {
    await delay(800);
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...userData };
    return users[index];
  },

  deleteUser: async (id) => {
    await delay(700);
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) throw new Error('User not found');
    users.splice(index, 1);
    return { success: true };
  },

  // Posts
  getPosts: async ({ page = 1, limit = 10 } = {}) => {
    await delay(1000);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: posts.slice(start, end),
      total: posts.length,
      page,
      hasMore: end < posts.length,
    };
  },

  getPost: async (id) => {
    await delay(600);
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) throw new Error('Post not found');
    return post;
  },

  createPost: async (postData) => {
    await delay(1000);
    const newPost = {
      id: posts.length + 1,
      likes: 0,
      ...postData,
    };
    posts.unshift(newPost);
    return newPost;
  },

  updatePost: async (id, postData) => {
    await delay(800);
    const index = posts.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Post not found');
    posts[index] = { ...posts[index], ...postData };
    return posts[index];
  },

  likePost: async (id) => {
    await delay(300);
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) throw new Error('Post not found');
    post.likes += 1;
    return post;
  },

  deletePost: async (id) => {
    await delay(700);
    const index = posts.findIndex(p => p.id === parseInt(id));
    if (index === -1) throw new Error('Post not found');
    posts.splice(index, 1);
    return { success: true };
  },

  // Comments
  getComments: async (postId) => {
    await delay(600);
    return comments.filter(c => c.postId === parseInt(postId));
  },

  // Infinite scroll
  getInfinitePosts: async ({ pageParam = 0 }) => {
    await delay(1000);
    const limit = 10;
    const start = pageParam * limit;
    const end = start + limit;

    return {
      posts: posts.slice(start, end),
      nextCursor: end < posts.length ? pageParam + 1 : undefined,
    };
  },

  // Search
  searchPosts: async (query) => {
    await delay(800);
    return posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase())
    );
  },
};
