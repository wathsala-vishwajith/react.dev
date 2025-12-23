import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Beginner Examples
import BasicQuery from './beginner/01-BasicQuery';
import QueryWithParams from './beginner/02-QueryWithParams';
import RefetchingData from './beginner/03-RefetchingData';

// Intermediate Examples
import Mutations from './intermediate/01-Mutations';
import Pagination from './intermediate/02-Pagination';
import DependentQueries from './intermediate/03-DependentQueries';

// Advanced Examples
import OptimisticUpdates from './advanced/01-OptimisticUpdates';
import InfiniteQueries from './advanced/02-InfiniteQueries';
import PrefetchingAndCaching from './advanced/03-PrefetchingAndCaching';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const examples = [
  {
    category: 'Beginner',
    items: [
      { id: 'basic-query', name: 'Basic Query', component: BasicQuery },
      { id: 'query-params', name: 'Query with Parameters', component: QueryWithParams },
      { id: 'refetching', name: 'Refetching Data', component: RefetchingData },
    ],
  },
  {
    category: 'Intermediate',
    items: [
      { id: 'mutations', name: 'Mutations (Create/Update/Delete)', component: Mutations },
      { id: 'pagination', name: 'Pagination', component: Pagination },
      { id: 'dependent-queries', name: 'Dependent Queries', component: DependentQueries },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { id: 'optimistic-updates', name: 'Optimistic Updates', component: OptimisticUpdates },
      { id: 'infinite-queries', name: 'Infinite Queries', component: InfiniteQueries },
      { id: 'prefetching', name: 'Prefetching & Caching', component: PrefetchingAndCaching },
    ],
  },
];

function App() {
  const [selectedExample, setSelectedExample] = useState('basic-query');

  // Find the selected component
  const ActiveComponent = examples
    .flatMap(cat => cat.items)
    .find(ex => ex.id === selectedExample)?.component || BasicQuery;

  return (
    <QueryClientProvider client={queryClient}>
      <div style={styles.app}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>🚀 TanStack Query Examples</h1>
          <p style={styles.subtitle}>
            Comprehensive examples from beginner to advanced
          </p>
        </header>

        <div style={styles.container}>
          {/* Sidebar Navigation */}
          <nav style={styles.sidebar}>
            {examples.map(category => (
              <div key={category.category} style={styles.category}>
                <h3 style={styles.categoryTitle}>{category.category}</h3>
                <div style={styles.exampleList}>
                  {category.items.map(example => (
                    <button
                      key={example.id}
                      onClick={() => setSelectedExample(example.id)}
                      style={{
                        ...styles.exampleButton,
                        ...(selectedExample === example.id
                          ? styles.activeButton
                          : {}),
                      }}
                    >
                      {example.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={styles.info}>
              <h4>💡 Tips</h4>
              <ul style={styles.tipsList}>
                <li>Open DevTools to see queries</li>
                <li>Try navigating between examples</li>
                <li>Notice how data is cached</li>
                <li>Experiment with the examples!</li>
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main style={styles.main}>
            <ActiveComponent />
          </main>
        </div>

        {/* React Query Devtools */}
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    borderBottom: '2px solid #e0e0e0',
    padding: '30px 20px',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '32px',
  },
  subtitle: {
    margin: 0,
    color: '#666',
    fontSize: '16px',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '20px',
    padding: '20px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  sidebar: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    height: 'fit-content',
    position: 'sticky',
    top: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  category: {
    marginBottom: '30px',
  },
  categoryTitle: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    textTransform: 'uppercase',
    color: '#999',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  exampleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  exampleButton: {
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    transition: 'all 0.2s',
    fontWeight: '500',
  },
  activeButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  info: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '8px',
    marginTop: '20px',
  },
  tipsList: {
    margin: '10px 0 0 0',
    paddingLeft: '20px',
    fontSize: '13px',
    lineHeight: '1.8',
  },
  main: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '30px',
    minHeight: '600px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
};

export default App;
