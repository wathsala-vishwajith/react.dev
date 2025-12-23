import './App.css'
import { Counter } from './components/Counter'
import { TodoList } from './components/TodoList'

function App() {
  return (
    <div className="app">
      <h1>React Testing Strategy Demo</h1>
      <p>This application demonstrates a complete testing strategy with Jest, React Testing Library, and Cypress.</p>

      <div className="components-container">
        <div className="component-section">
          <Counter initialCount={0} />
        </div>

        <div className="component-section">
          <TodoList />
        </div>
      </div>
    </div>
  )
}

export default App
