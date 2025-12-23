import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/mockApi';

/**
 * ADVANCED EXAMPLE 3: Prefetching and Advanced Caching
 *
 * Learn how to:
 * - Prefetch data before it's needed
 * - Configure cache time and stale time
 * - Use query placeholders
 * - Implement smart data preloading
 */

export default function PrefetchingAndCaching() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [hoveredUserId, setHoveredUserId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch users with custom cache settings
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep unused data in cache for 10 minutes (formerly cacheTime)
  });

  // Fetch selected user details
  const userQuery = useQuery({
    queryKey: ['user', selectedUserId],
    queryFn: () => api.getUser(selectedUserId),
    enabled: !!selectedUserId,
    staleTime: 2 * 60 * 1000,
    // Show placeholder data while fetching
    placeholderData: (previousData) => previousData,
  });

  // Prefetch user data on hover
  const handleMouseEnter = (userId) => {
    setHoveredUserId(userId);
    // Prefetch user data when hovering over user card
    queryClient.prefetchQuery({
      queryKey: ['user', userId],
      queryFn: () => api.getUser(userId),
      staleTime: 2 * 60 * 1000,
    });
  };

  const handleMouseLeave = () => {
    setHoveredUserId(null);
  };

  // Get cache state for demonstration
  const getCacheState = () => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().map(query => ({
      key: query.queryKey,
      state: query.state.status,
      dataUpdatedAt: query.state.dataUpdatedAt,
    }));
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Prefetching & Advanced Caching</h2>
      <p style={styles.description}>
        This example demonstrates advanced caching strategies:
        <br />• <strong>Hover</strong> over a user card to prefetch their data
        <br />• <strong>Click</strong> to view details - data loads instantly if prefetched!
        <br />• Custom staleTime and gcTime configurations
        <br />• Placeholder data while refetching
      </p>

      <div style={styles.layout}>
        {/* Users List */}
        <div style={styles.sidebar}>
          <h3>Users</h3>
          <p style={styles.hint}>
            Hover to prefetch, click to view
          </p>
          <div style={styles.usersList}>
            {users.map(user => {
              const isPrefetched = queryClient.getQueryData(['user', user.id]);
              const isHovered = hoveredUserId === user.id;
              const isSelected = selectedUserId === user.id;

              return (
                <div
                  key={user.id}
                  style={{
                    ...styles.userCard,
                    ...(isSelected ? styles.selectedCard : {}),
                    ...(isHovered ? styles.hoveredCard : {}),
                  }}
                  onMouseEnter={() => handleMouseEnter(user.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div style={styles.userCardHeader}>
                    <strong>{user.name}</strong>
                    {isPrefetched && (
                      <span style={styles.cachedBadge} title="Data is cached">
                        💾
                      </span>
                    )}
                  </div>
                  <div style={styles.userCardSubtext}>{user.email}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Details */}
        <div style={styles.mainContent}>
          {!selectedUserId ? (
            <div style={styles.placeholder}>
              <h3>Hover and Click to See Prefetching in Action</h3>
              <p>
                When you hover over a user, we prefetch their data.
                When you click, the data is already cached and loads instantly!
              </p>
            </div>
          ) : (
            <>
              {userQuery.isLoading ? (
                <div style={styles.loading}>Loading user details...</div>
              ) : userQuery.data ? (
                <div style={styles.detailsCard}>
                  <h3>{userQuery.data.name}</h3>
                  <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                      <strong>ID:</strong> {userQuery.data.id}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Email:</strong> {userQuery.data.email}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Role:</strong>{' '}
                      <span style={styles.roleBadge}>
                        {userQuery.data.role}
                      </span>
                    </div>
                  </div>

                  {userQuery.isFetching && (
                    <div style={styles.refetchingIndicator}>
                      Refreshing data in background...
                    </div>
                  )}
                </div>
              ) : null}

              {/* Cache Information */}
              <div style={styles.cacheInfo}>
                <h4>Query State</h4>
                <div style={styles.cacheDetails}>
                  <div>
                    <strong>Status:</strong> {userQuery.status}
                  </div>
                  <div>
                    <strong>Is Stale:</strong> {userQuery.isStale ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Is Fetching:</strong> {userQuery.isFetching ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Last Updated:</strong>{' '}
                    {userQuery.dataUpdatedAt
                      ? new Date(userQuery.dataUpdatedAt).toLocaleTimeString()
                      : 'Never'}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* All Cached Queries */}
          <div style={styles.allCacheSection}>
            <h4>All Cached Queries ({getCacheState().length})</h4>
            <div style={styles.cacheList}>
              {getCacheState().map((item, index) => (
                <div key={index} style={styles.cacheItem}>
                  <div>
                    <strong>Key:</strong> {JSON.stringify(item.key)}
                  </div>
                  <div style={styles.cacheItemMeta}>
                    <span style={styles.statusBadge}>{item.state}</span>
                    <span>
                      {new Date(item.dataUpdatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.info}>
        <h3>Key Concepts:</h3>
        <ul>
          <li>
            <strong>prefetchQuery():</strong> Preload data before user needs it
          </li>
          <li>
            <strong>staleTime:</strong> How long data is considered fresh (no refetch)
          </li>
          <li>
            <strong>gcTime:</strong> How long unused data stays in cache (formerly cacheTime)
          </li>
          <li>
            <strong>placeholderData:</strong> Show old data while fetching new data
          </li>
          <li>
            <strong>getQueryData():</strong> Check if data exists in cache
          </li>
          <li>
            <strong>Smart prefetching:</strong> Improves perceived performance
          </li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  description: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    lineHeight: '1.6',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: '20px',
    marginBottom: '30px',
  },
  sidebar: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    maxHeight: '700px',
    overflowY: 'auto',
  },
  hint: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
    marginBottom: '15px',
  },
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  userCard: {
    padding: '12px',
    backgroundColor: '#fff',
    border: '2px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  hoveredCard: {
    borderColor: '#ffc107',
    backgroundColor: '#fffef7',
  },
  selectedCard: {
    borderColor: '#007bff',
    backgroundColor: '#e7f3ff',
  },
  userCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  cachedBadge: {
    fontSize: '16px',
  },
  userCardSubtext: {
    fontSize: '13px',
    color: '#666',
  },
  mainContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  placeholder: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  detailsCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginTop: '15px',
  },
  detailItem: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '6px',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
  },
  refetchingIndicator: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    textAlign: 'center',
    color: '#856404',
    fontStyle: 'italic',
  },
  cacheInfo: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  cacheDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    marginTop: '10px',
  },
  allCacheSection: {
    backgroundColor: '#f0f0f0',
    padding: '15px',
    borderRadius: '8px',
  },
  cacheList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  cacheItem: {
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    fontSize: '13px',
  },
  cacheItemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '5px',
    color: '#666',
  },
  statusBadge: {
    padding: '2px 8px',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '10px',
    fontSize: '11px',
  },
  info: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #ffc107',
  },
};
