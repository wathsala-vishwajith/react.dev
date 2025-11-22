export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

/**
 * Fetches users from an API
 */
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

/**
 * Fetches a user by ID
 */
export const fetchUserById = async (id: number): Promise<User> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with id ${id}`);
  }
  return response.json();
};

/**
 * Fetches posts
 */
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

/**
 * Creates a new post
 */
export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};
