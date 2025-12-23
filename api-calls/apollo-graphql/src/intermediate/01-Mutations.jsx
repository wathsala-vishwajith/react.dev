import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS } from '../graphql/queries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from '../graphql/mutations';

/**
 * INTERMEDIATE EXAMPLE 1: Mutations
 *
 * Learn how to:
 * - Use useMutation for creating/updating/deleting data
 * - Update the cache after mutations
 * - Use refetchQueries to refresh data
 * - Handle mutation states (loading, error, success)
 */

export default function Mutations() {
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Fetch users
  const { loading, data } = useQuery(GET_USERS);

  // Create user mutation
  const [createUser, { loading: creating, error: createError }] = useMutation(
    CREATE_USER,
    {
      // Option 1: Automatically refetch queries after mutation
      refetchQueries: [{ query: GET_USERS }],
      // Option 2: You could manually update the cache (shown in advanced examples)
      onCompleted: () => {
        setNewUserName('');
        setNewUserEmail('');
      },
    }
  );

  // Delete user mutation
  const [deleteUser, { loading: deleting }] = useMutation(
    DELETE_USER,
    {
      refetchQueries: [{ query: GET_USERS }],
    }
  );

  // Update user mutation
  const [updateUser, { loading: updating }] = useMutation(
    UPDATE_USER,
    {
      refetchQueries: [{ query: GET_USERS }],
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newUserName && newUserEmail) {
      createUser({
        variables: {
          name: newUserName,
          email: newUserEmail,
          role: 'User',
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser({ variables: { id } });
    }
  };

  const handleToggleRole = (user) => {
    const newRole = user.role === 'Admin' ? 'User' : 'Admin';
    updateUser({
      variables: {
        id: user.id,
        role: newRole,
      },
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Mutations Example</h2>
      <p style={styles.description}>
        This example demonstrates how to use GraphQL mutations with Apollo Client
        for create, update, and delete operations. After each mutation, we
        automatically refetch the users query to keep the UI in sync.
      </p>

      <div style={styles.queryBox}>
        <h4>Example Mutation:</h4>
        <pre style={styles.code}>{`mutation CreateUser($name: String!, $email: String!, $role: String!) {
  createUser(name: $name, email: $email, role: $role) {
    id
    name
    email
    role
  }
}`}</pre>
      </div>

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
            disabled={creating}
            style={styles.button}
          >
            {creating ? 'Creating...' : 'Create User'}
          </button>
        </form>

        {createError && (
          <div style={styles.error}>
            Error: {createError.message}
          </div>
        )}
      </div>

      {/* Users List */}
      <div style={styles.usersSection}>
        <h3>Users ({data.users.length})</h3>
        <div style={styles.userList}>
          {data.users.map(user => (
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
                  disabled={updating}
                  style={styles.actionButton}
                >
                  Toggle Role
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={deleting}
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
          <li>
            <strong>useMutation:</strong> Hook for GraphQL mutations
          </li>
          <li>
            <strong>Variables:</strong> Pass data to mutations using variables
          </li>
          <li>
            <strong>refetchQueries:</strong> Automatically refetch queries after mutation
          </li>
          <li>
            <strong>onCompleted:</strong> Callback that runs after successful mutation
          </li>
          <li>
            <strong>Loading states:</strong> Track mutation progress with loading boolean
          </li>
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
  queryBox: {
    backgroundColor: '#282c34',
    color: '#61dafb',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  code: {
    margin: '10px 0 0 0',
    fontSize: '13px',
    fontFamily: 'monospace',
    color: '#abb2bf',
    overflow: 'auto',
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
