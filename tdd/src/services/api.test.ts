import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchUsers, fetchUserById, fetchPosts, createPost } from './api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe('fetchUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

      const users = await fetchUsers();
      expect(users).toEqual(mockUsers);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users'
      );
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
    });
  });

  describe('fetchUserById', () => {
    it('should fetch a single user by id', async () => {
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const user = await fetchUserById(1);
      expect(user).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/users/1'
      );
    });

    it('should throw error when user is not found', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchUserById(999)).rejects.toThrow(
        'Failed to fetch user with id 999'
      );
    });
  });

  describe('fetchPosts', () => {
    it('should fetch posts successfully', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', body: 'Content 1', userId: 1 },
        { id: 2, title: 'Post 2', body: 'Content 2', userId: 1 },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPosts,
      });

      const posts = await fetchPosts();
      expect(posts).toEqual(mockPosts);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts'
      );
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchPosts()).rejects.toThrow('Failed to fetch posts');
    });
  });

  describe('createPost', () => {
    it('should create a post successfully', async () => {
      const newPost = {
        title: 'New Post',
        body: 'New Content',
        userId: 1,
      };

      const createdPost = {
        id: 101,
        ...newPost,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => createdPost,
      });

      const result = await createPost(newPost);
      expect(result).toEqual(createdPost);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://jsonplaceholder.typicode.com/posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        }
      );
    });

    it('should throw error when creation fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(
        createPost({ title: 'Test', body: 'Test', userId: 1 })
      ).rejects.toThrow('Failed to create post');
    });
  });
});
