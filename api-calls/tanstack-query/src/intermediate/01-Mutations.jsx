import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * INTERMEDIATE EXAMPLE 1: Mutations
 *
 * Learn how to:
 * - Use useMutation for creating/updating/deleting data
 * - Invalidate queries after mutations
 * - Handle mutation states (loading, error, success)
 * - Use onSuccess callbacks
 */

export default function Mutations() {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      // Invalidate and refetch users after successful creation
      queryClient.invalidateQueries({ queryKey: ['users'] });
      // Clear form
      setNewUserName('');
      setNewUserEmail('');
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: api.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUserName && newUserEmail) {
      createUserMutation.mutate({
        name: newUserName,
        email: newUserEmail,
        role: 'User',
      });
    }
  };

  const handleDelete = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleToggleRole = (user) => {
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';
    updateUserMutation.mutate({
      id: user.id,
      data: { ...user, role: newRole },
    });
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Mutations Example</h2>
      <p style={styles.description}>
        This example demonstrates how to use useMutation for creating, updating,
        and deleting data. After each mutation, we invalidate the users query to
        trigger a refetch.
      </p>

      {/* Create User Form */}
      <div style={styles.formSection}>
        <h3>Create New User</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            style={styles.button}
          >
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>

        {createUserMutation.isError && (
          <div style={styles.error}>
            Error: {createUserMutation.error.message}
          </div>
        )}

        {createUserMutation.isSuccess && (
          <div style={styles.success}>User created successfully!</div>
        )}
      </div>

      {/* Users List */}
      <div style={styles.usersSection}>
        <h3>Users ({users.length})</h3>
        <div style={styles.userList}>
          {users.map(user => (
            <div key={user.id} style={styles.userCard}>
              <div style={styles.userInfo}>
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor: user.role === 'Admin' ? '#dc3545' : '#28a745',
                  }}
                >
                  {user.role}
                </span>
              </div>
              <div style={styles.actions}>
                <button
                  onClick={() => handleToggleRole(user)}
                  disabled={updateUserMutation.isPending}
                  style={styles.actionButton}
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deleteUserMutation.isPending}
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li><strong>useMutation:</strong> Hook for create/update/delete operations</li>
          <li><strong>mutate():</strong> Function to trigger the mutation</li>
          <li><strong>invalidateQueries():</strong> Mark queries as stale to trigger refetch</li>
          <li><strong>onSuccess:</strong> Callback that runs after successful mutation</li>
          <li><strong>isPending:</strong> True while mutation is in progress</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  description: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  formSection: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '10px',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '10px',
  },
  usersSection: {
    marginBottom: '30px',
  },
  userList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  userCard: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
