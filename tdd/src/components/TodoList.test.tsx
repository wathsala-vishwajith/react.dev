import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';

describe('TodoList Component', () => {
  it('should render with empty todo list', () => {
    render(<TodoList />);
    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(screen.getByTestId('empty-message')).toHaveTextContent('No todos yet');
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Total: 0 | Completed: 0');
  });

  it('should add a new todo when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');
    const addBtn = screen.getByTestId('add-todo-btn');

    await user.type(input, 'Buy groceries');
    await user.click(addBtn);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-message')).not.toBeInTheDocument();
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Total: 1 | Completed: 0');
  });

  it('should add a new todo when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');

    await user.type(input, 'Write tests{Enter}');

    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('should clear input after adding todo', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input') as HTMLInputElement;
    const addBtn = screen.getByTestId('add-todo-btn');

    await user.type(input, 'Test task');
    await user.click(addBtn);

    expect(input.value).toBe('');
  });

  it('should not add empty todos', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const addBtn = screen.getByTestId('add-todo-btn');

    await user.click(addBtn);

    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Total: 0');
  });

  it('should not add todos with only whitespace', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');
    const addBtn = screen.getByTestId('add-todo-btn');

    await user.type(input, '   ');
    await user.click(addBtn);

    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
  });

  it('should toggle todo completion status', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');
    const addBtn = screen.getByTestId('add-todo-btn');

    await user.type(input, 'Complete this task');
    await user.click(addBtn);

    const todoText = screen.getByText('Complete this task');
    const checkbox = screen.getByRole('checkbox');

    // Initially not completed
    expect(checkbox).not.toBeChecked();
    expect(todoText).toHaveStyle({ textDecoration: 'none' });
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Completed: 0');

    // Toggle to completed
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(todoText).toHaveStyle({ textDecoration: 'line-through' });
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Completed: 1');

    // Toggle back to not completed
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(todoText).toHaveStyle({ textDecoration: 'none' });
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Completed: 0');
  });

  it('should delete a todo', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');
    const addBtn = screen.getByTestId('add-todo-btn');

    await user.type(input, 'Task to delete');
    await user.click(addBtn);

    expect(screen.getByText('Task to delete')).toBeInTheDocument();

    const deleteBtn = screen.getByText('Delete');
    await user.click(deleteBtn);

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
    expect(screen.getByTestId('empty-message')).toBeInTheDocument();
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Total: 0');
  });

  it('should handle multiple todos', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');
    const addBtn = screen.getByTestId('add-todo-btn');

    // Add multiple todos
    await user.type(input, 'Task 1');
    await user.click(addBtn);

    await user.type(input, 'Task 2');
    await user.click(addBtn);

    await user.type(input, 'Task 3');
    await user.click(addBtn);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Total: 3 | Completed: 0');

    // Complete one
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    expect(screen.getByTestId('todo-stats')).toHaveTextContent('Total: 3 | Completed: 1');
  });

  it('should maintain todo order', async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByTestId('todo-input');
    const addBtn = screen.getByTestId('add-todo-btn');

    await user.type(input, 'First');
    await user.click(addBtn);

    await user.type(input, 'Second');
    await user.click(addBtn);

    await user.type(input, 'Third');
    await user.click(addBtn);

    const todos = screen.getAllByText(/First|Second|Third/);
    expect(todos[0]).toHaveTextContent('First');
    expect(todos[1]).toHaveTextContent('Second');
    expect(todos[2]).toHaveTextContent('Third');
  });
});
