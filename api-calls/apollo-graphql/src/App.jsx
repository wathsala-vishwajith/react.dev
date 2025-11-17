import { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { createApolloClient } from './utils/apolloClient';

// Beginner Examples
import BasicQuery from './beginner/01-BasicQuery';
import QueryWithVariables from './beginner/02-QueryWithVariables';
import RefetchingData from './beginner/03-RefetchingData';

// Intermediate Examples
import Mutations from './intermediate/01-Mutations';
import Pagination from './intermediate/02-Pagination';
import LocalState from './intermediate/03-LocalState';

// Advanced Examples
import OptimisticUI from './advanced/01-OptimisticUI';
import CacheManipulation from './advanced/02-CacheManipulation';
import ErrorHandling from './advanced/03-ErrorHandling';

const client = createApolloClient();

const examples = [
  {
    category: 'Beginner',
    items: [
      { id: 'basic-query', name: 'Basic Query', component: BasicQuery },
      { id: 'query-variables', name: 'Query with Variables', component: QueryWithVariables },
      { id: 'refetching', name: 'Refetching Data', component: RefetchingData },
    ],
  },
  {
    category: 'Intermediate',
    items: [
      { id: 'mutations', name: 'Mutations (CRUD)', component: Mutations },
      { id: 'pagination', name: 'Pagination', component: Pagination },
      { id: 'local-state', name: 'Local State Management', component: LocalState },
    ],
  },
  {
    category: 'Advanced',
    items: [
      { id: 'optimistic-ui', name: 'Optimistic UI', component: OptimisticUI },
      { id: 'cache-manipulation', name: 'Cache Manipulation', component: CacheManipulation },
      { id: 'error-handling', name: 'Error Handling', component: ErrorHandling },
    ],
  },
];

function App() {
  const [selectedExample, setSelectedExample] = useState('basic-query');

  const ActiveComponent = examples
    .flatMap(cat => cat.items)
    .find(ex => ex.id === selectedExample)?.component || BasicQuery;

  return (
    <ApolloProvider client={client}>
      <div style={styles.app}>
        <header style={styles.header}>
          <h1 style={styles.title}>🚀 Apollo GraphQL Examples</h1>
          <p style={styles.subtitle}>
            Comprehensive examples from beginner to advanced
          </p>
        </header>

        <div style={styles.container}>
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
                        ...(selectedExample === example.id ? styles.activeButton : {}),
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
                <li>Open Browser DevTools</li>
                <li>Check Network tab for GraphQL requests</li>
                <li>Experiment with queries and mutations</li>
                <li>Notice the caching behavior!</li>
              </ul>
            </div>
          </nav>

          <main style={styles.main}>
            <ActiveComponent />
          </main>
        </div>
      </div>
    </ApolloProvider>
  );
}

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', borderBottom: '2px solid #e0e0e0', padding: '30px 20px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  title: { margin: '0 0 10px 0', color: '#333', fontSize: '32px' },
  subtitle: { margin: 0, color: '#666', fontSize: '16px' },
  container: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto' },
  sidebar: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', height: 'fit-content', position: 'sticky', top: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  category: { marginBottom: '30px' },
  categoryTitle: { margin: '0 0 15px 0', fontSize: '14px', textTransform: 'uppercase', color: '#999', fontWeight: '600', letterSpacing: '0.5px' },
  exampleList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  exampleButton: { padding: '12px 16px', backgroundColor: 'transparent', border: 'none', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontSize: '14px', color: '#333', transition: 'all 0.2s', fontWeight: '500' },
  activeButton: { backgroundColor: '#007bff', color: '#fff' },
  info: { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '20px' },
  tipsList: { margin: '10px 0 0 0', paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' },
  main: { backgroundColor: '#fff', borderRadius: '8px', padding: '30px', minHeight: '600px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
};

export default App;
