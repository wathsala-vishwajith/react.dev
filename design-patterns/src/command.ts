/**
 * COMMAND PATTERN
 *
 * Definition: Encapsulates a request as an object, thereby letting you parameterize
 * clients with different requests, queue or log requests, and support undoable operations.
 *
 * When to Use:
 * - When you need to parameterize objects with operations
 * - When you need to queue operations, schedule their execution, or execute them remotely
 * - When you need to implement reversible operations (undo/redo)
 * - When you want to structure a system around high-level operations built on primitive operations
 *
 * Real-world Use Cases:
 * - Undo/Redo functionality in text editors
 * - Transactional behavior and logging
 * - Task scheduling and job queues
 * - Remote procedure calls
 * - GUI buttons and menu items
 * - Macro recording
 */

// Command Interface
interface Command {
  execute(): void;
  undo(): void;
}

// Receiver: Text Editor
class TextEditor {
  private text: string = '';

  getText(): string {
    return this.text;
  }

  write(text: string): void {
    this.text += text;
  }

  deleteText(length: number): void {
    this.text = this.text.slice(0, -length);
  }

  clear(): void {
    this.text = '';
  }

  display(): void {
    console.log(`📝 Editor content: "${this.text}"`);
  }
}

// Concrete Commands
class WriteCommand implements Command {
  constructor(
    private editor: TextEditor,
    private textToWrite: string
  ) {}

  execute(): void {
    this.editor.write(this.textToWrite);
    console.log(`✏️ Written: "${this.textToWrite}"`);
  }

  undo(): void {
    this.editor.deleteText(this.textToWrite.length);
    console.log(`↩️ Undone write: "${this.textToWrite}"`);
  }
}

class DeleteCommand implements Command {
  private deletedText: string = '';

  constructor(
    private editor: TextEditor,
    private length: number
  ) {}

  execute(): void {
    const currentText = this.editor.getText();
    this.deletedText = currentText.slice(-this.length);
    this.editor.deleteText(this.length);
    console.log(`🗑️ Deleted: "${this.deletedText}"`);
  }

  undo(): void {
    this.editor.write(this.deletedText);
    console.log(`↩️ Undone delete: "${this.deletedText}"`);
  }
}

class ClearCommand implements Command {
  private previousText: string = '';

  constructor(private editor: TextEditor) {}

  execute(): void {
    this.previousText = this.editor.getText();
    this.editor.clear();
    console.log('🗑️ Cleared editor');
  }

  undo(): void {
    this.editor.write(this.previousText);
    console.log(`↩️ Restored: "${this.previousText}"`);
  }
}

// Invoker
class CommandManager {
  private history: Command[] = [];
  private currentIndex: number = -1;

  executeCommand(command: Command): void {
    // Remove any commands after current index (for new commands after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);

    command.execute();
    this.history.push(command);
    this.currentIndex++;
  }

  undo(): void {
    if (this.currentIndex < 0) {
      console.log('❌ Nothing to undo');
      return;
    }

    const command = this.history[this.currentIndex];
    command.undo();
    this.currentIndex--;
  }

  redo(): void {
    if (this.currentIndex >= this.history.length - 1) {
      console.log('❌ Nothing to redo');
      return;
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    command.execute();
  }
}

// Practical Example 2: Smart Home System
interface HomeCommand {
  execute(): void;
  undo(): void;
}

class Light {
  private isOn: boolean = false;

  turnOn(): void {
    this.isOn = true;
    console.log('💡 Light is ON');
  }

  turnOff(): void {
    this.isOn = false;
    console.log('💡 Light is OFF');
  }

  getStatus(): boolean {
    return this.isOn;
  }
}

class Thermostat {
  private temperature: number = 20;

  setTemperature(temp: number): void {
    this.temperature = temp;
    console.log(`🌡️ Temperature set to ${temp}°C`);
  }

  getTemperature(): number {
    return this.temperature;
  }
}

class LightOnCommand implements HomeCommand {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

class LightOffCommand implements HomeCommand {
  constructor(private light: Light) {}

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
  }
}

class ThermostatCommand implements HomeCommand {
  private previousTemp: number;

  constructor(
    private thermostat: Thermostat,
    private newTemp: number
  ) {
    this.previousTemp = thermostat.getTemperature();
  }

  execute(): void {
    this.previousTemp = this.thermostat.getTemperature();
    this.thermostat.setTemperature(this.newTemp);
  }

  undo(): void {
    this.thermostat.setTemperature(this.previousTemp);
    console.log('↩️ Temperature restored');
  }
}

class RemoteControl {
  private commands: Map<string, HomeCommand> = new Map();
  private commandHistory: HomeCommand[] = [];

  setCommand(button: string, command: HomeCommand): void {
    this.commands.set(button, command);
    console.log(`🎮 Button "${button}" configured`);
  }

  pressButton(button: string): void {
    const command = this.commands.get(button);
    if (command) {
      command.execute();
      this.commandHistory.push(command);
    } else {
      console.log(`❌ No command assigned to button "${button}"`);
    }
  }

  pressUndo(): void {
    const command = this.commandHistory.pop();
    if (command) {
      command.undo();
    } else {
      console.log('❌ No command to undo');
    }
  }
}

// Practical Example 3: Task Queue
interface Task {
  execute(): void;
  undo(): void;
  getDescription(): string;
}

class EmailTask implements Task {
  constructor(
    private recipient: string,
    private subject: string
  ) {}

  execute(): void {
    console.log(`📧 Sending email to ${this.recipient}: ${this.subject}`);
  }

  undo(): void {
    console.log(`↩️ Cancelled email to ${this.recipient}`);
  }

  getDescription(): string {
    return `Email to ${this.recipient}`;
  }
}

class DatabaseTask implements Task {
  constructor(
    private query: string,
    private data: any
  ) {}

  execute(): void {
    console.log(`💾 Executing DB query: ${this.query}`);
    console.log(`   Data:`, this.data);
  }

  undo(): void {
    console.log(`↩️ Rolling back DB query: ${this.query}`);
  }

  getDescription(): string {
    return `Database: ${this.query}`;
  }
}

class FileTask implements Task {
  constructor(
    private filename: string,
    private operation: 'create' | 'delete'
  ) {}

  execute(): void {
    if (this.operation === 'create') {
      console.log(`📁 Creating file: ${this.filename}`);
    } else {
      console.log(`🗑️ Deleting file: ${this.filename}`);
    }
  }

  undo(): void {
    if (this.operation === 'create') {
      console.log(`↩️ Removing file: ${this.filename}`);
    } else {
      console.log(`↩️ Restoring file: ${this.filename}`);
    }
  }

  getDescription(): string {
    return `File ${this.operation}: ${this.filename}`;
  }
}

class TaskQueue {
  private queue: Task[] = [];
  private executed: Task[] = [];

  addTask(task: Task): void {
    this.queue.push(task);
    console.log(`➕ Added task: ${task.getDescription()}`);
  }

  processQueue(): void {
    console.log(`\n⚙️ Processing ${this.queue.length} tasks...`);
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      task.execute();
      this.executed.push(task);
    }
    console.log('✅ All tasks processed');
  }

  undoLastTask(): void {
    const task = this.executed.pop();
    if (task) {
      task.undo();
    } else {
      console.log('❌ No task to undo');
    }
  }
}

// Demo function
export function demoCommand(): void {
  console.log('\n=== COMMAND PATTERN DEMO ===\n');

  // Example 1: Text Editor with Undo/Redo
  console.log('--- Text Editor Example ---');
  const editor = new TextEditor();
  const commandManager = new CommandManager();

  commandManager.executeCommand(new WriteCommand(editor, 'Hello'));
  editor.display();

  commandManager.executeCommand(new WriteCommand(editor, ' World'));
  editor.display();

  commandManager.executeCommand(new WriteCommand(editor, '!'));
  editor.display();

  console.log('\nUndo operations:');
  commandManager.undo();
  editor.display();

  commandManager.undo();
  editor.display();

  console.log('\nRedo operations:');
  commandManager.redo();
  editor.display();

  commandManager.executeCommand(new DeleteCommand(editor, 6));
  editor.display();

  commandManager.executeCommand(new ClearCommand(editor));
  editor.display();

  commandManager.undo();
  editor.display();

  // Example 2: Smart Home Remote Control
  console.log('\n--- Smart Home Remote Control Example ---');
  const livingRoomLight = new Light();
  const bedroom Light = new Light();
  const thermostat = new Thermostat();

  const remote = new RemoteControl();
  remote.setCommand('1', new LightOnCommand(livingRoomLight));
  remote.setCommand('2', new LightOffCommand(livingRoomLight));
  remote.setCommand('3', new LightOnCommand(bedroomLight));
  remote.setCommand('4', new ThermostatCommand(thermostat, 24));

  console.log('\nExecuting commands:');
  remote.pressButton('1'); // Living room light on
  remote.pressButton('3'); // Bedroom light on
  remote.pressButton('4'); // Set temperature to 24

  console.log('\nUndo last command:');
  remote.pressUndo(); // Undo temperature change
  remote.pressUndo(); // Turn off bedroom light

  // Example 3: Task Queue
  console.log('\n--- Task Queue Example ---');
  const taskQueue = new TaskQueue();

  taskQueue.addTask(new EmailTask('admin@example.com', 'System Alert'));
  taskQueue.addTask(new DatabaseTask('INSERT INTO users', { name: 'John', email: 'john@example.com' }));
  taskQueue.addTask(new FileTask('report.pdf', 'create'));
  taskQueue.addTask(new EmailTask('user@example.com', 'Welcome!'));

  taskQueue.processQueue();

  console.log('\nUndo last two tasks:');
  taskQueue.undoLastTask();
  taskQueue.undoLastTask();

  console.log('\n✅ Command Pattern encapsulates requests as objects and supports undo/redo\n');
}
