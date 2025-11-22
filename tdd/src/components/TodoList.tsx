import { useState } from 'react';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a todo..."
          data-testid="todo-input"
        />
        <button onClick={addTodo} data-testid="add-todo-btn">
          Add
        </button>
      </div>
      <ul data-testid="todo-list">
        {todos.length === 0 && (
          <li data-testid="empty-message">No todos yet</li>
        )}
        {todos.map((todo) => (
          <li key={todo.id} data-testid={`todo-item-${todo.id}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              data-testid={`todo-checkbox-${todo.id}`}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
              data-testid={`todo-text-${todo.id}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              data-testid={`delete-btn-${todo.id}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <div data-testid="todo-stats">
        Total: {todos.length} | Completed: {todos.filter((t) => t.completed).length}
      </div>
    </div>
  );
};
