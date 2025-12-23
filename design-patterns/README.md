# Design Patterns in TypeScript

A comprehensive TypeScript repository showcasing **10 essential design patterns** with practical, real-world use cases and detailed explanations.

## 📚 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Design Patterns](#design-patterns)
  - [Creational Patterns](#creational-patterns)
  - [Structural Patterns](#structural-patterns)
  - [Behavioral Patterns](#behavioral-patterns)
- [Usage Examples](#usage-examples)
- [When to Use Each Pattern](#when-to-use-each-pattern)
- [Best Practices](#best-practices)

## 🎯 Overview

This repository demonstrates 10 fundamental design patterns that every software developer should know. Each pattern is implemented in TypeScript with:

- ✅ Clear, well-documented code
- ✅ Multiple practical, real-world examples
- ✅ Explanations of when and why to use each pattern
- ✅ Runnable demonstrations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd design-patterns

# Install dependencies
npm install

# Build the project
npm run build

# Run all patterns
npm run dev

# Run a specific pattern
npm run dev factory
npm run dev builder
npm run dev observer
```

## 📖 Design Patterns

### Creational Patterns

Creational patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.

#### 1. Factory Pattern

**Definition:** Creates objects without exposing the creation logic to the client.

**When to Use:**
- When you don't know beforehand the exact types of objects your code should work with
- When you want to provide users with a way to extend internal components
- When you want to save system resources by reusing existing objects

**Real-world Use Cases:**
- UI component libraries (different button types)
- Database connection factories
- Payment processing systems
- Notification systems

**Example:**
```typescript
const car = VehicleFactory.createVehicle('car');
car.drive(); // 🚗 Driving a Car with 4 wheels
```

**File:** `src/factory.ts`

---

#### 2. Builder Pattern

**Definition:** Separates the construction of a complex object from its representation, allowing step-by-step construction.

**When to Use:**
- When you need to create complex objects with many optional parameters
- When you want to avoid telescoping constructor anti-pattern
- When the construction process must allow different representations

**Real-world Use Cases:**
- Building complex queries (SQL, MongoDB)
- Creating HTTP requests with many optional parameters
- Constructing UI forms with various configurations
- Building emails with attachments, CC, BCC, etc.

**Example:**
```typescript
const computer = new ComputerBuilder()
  .setCPU('Intel i9')
  .setRAM('32GB')
  .setStorage('2TB SSD')
  .setGPU('NVIDIA RTX 4090')
  .build();
```

**File:** `src/builder.ts`

---

#### 3. Singleton Pattern

**Definition:** Ensures a class has only one instance and provides a global point of access to it.

**When to Use:**
- When exactly one instance of a class is needed throughout the application
- When you need strict control over global variables
- When you want to ensure thread-safe access to a shared resource

**Real-world Use Cases:**
- Database connections
- Configuration managers
- Logger services
- Cache managers
- Application state managers

**Example:**
```typescript
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true - same instance
```

**File:** `src/singleton.ts`

**⚠️ Note:** Use Singleton sparingly as it can make testing difficult and introduces global state. Consider dependency injection as an alternative.

---

#### 4. Prototype Pattern

**Definition:** Creates new objects by cloning existing objects (prototypes) rather than creating from scratch.

**When to Use:**
- When creating an object is expensive (requires database queries or complex calculations)
- When you want to avoid subclasses of an object creator
- When classes to instantiate are specified at runtime
- When you need to create objects similar to existing objects

**Real-world Use Cases:**
- Cloning complex object graphs
- Creating game objects from templates
- Document templates and form templates
- Configuration presets

**Example:**
```typescript
const baseWarrior = new GameCharacter('Warrior', 10, 1000, ...);
const warrior1 = baseWarrior.clone();
warrior1.name = 'Aragorn';
```

**File:** `src/prototype.ts`

---

### Structural Patterns

Structural patterns explain how to assemble objects and classes into larger structures while keeping these structures flexible and efficient.

#### 5. Adapter Pattern

**Definition:** Converts the interface of a class into another interface that clients expect, allowing incompatible interfaces to work together.

**When to Use:**
- When you want to use an existing class but its interface doesn't match what you need
- When integrating third-party libraries with different interfaces
- When you need to support multiple payment gateways or APIs
- When adapting different database drivers to a common interface

**Real-world Use Cases:**
- Integrating legacy systems with modern code
- Working with third-party APIs
- Supporting multiple payment gateways
- Converting data formats (XML to JSON)

**Example:**
```typescript
const stripeProcessor: PaymentProcessor = new StripeAdapter();
stripeProcessor.processPayment(99.99, 'USD');
```

**File:** `src/adapter.ts`

---

#### 6. Decorator Pattern

**Definition:** Attaches additional responsibilities to an object dynamically, providing a flexible alternative to subclassing.

**When to Use:**
- When you need to add responsibilities to objects dynamically
- When extension by subclassing is impractical
- When you want to add or remove responsibilities at runtime
- When you need to combine several behaviors in various ways

**Real-world Use Cases:**
- Adding features to GUI components (borders, scrollbars)
- Extending text formatting (bold, italic, underline)
- Adding middleware to HTTP requests/responses
- Enhancing coffee orders (milk, sugar, whipped cream)

**Example:**
```typescript
let coffee: Coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
// Coffee with milk and sugar
```

**File:** `src/decorator.ts`

---

### Behavioral Patterns

Behavioral patterns are concerned with algorithms and the assignment of responsibilities between objects.

#### 7. Observer Pattern

**Definition:** Defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically.

**When to Use:**
- When changes to one object require changing others
- When an object should notify other objects without assumptions about who they are
- When you need to implement event handling systems
- When you want to achieve loose coupling between objects

**Real-world Use Cases:**
- Event handling systems (DOM events)
- State management (Redux, MobX)
- Real-time data updates (stock prices, chat)
- Newsletter/notification systems
- Model-View-Controller (MVC) architecture

**Example:**
```typescript
const stock = new StockPrice('AAPL', 150.00);
stock.attach(mobileApp);
stock.attach(emailAlert);
stock.setPrice(165.50); // Notifies all observers
```

**File:** `src/observer.ts`

---

#### 8. Strategy Pattern

**Definition:** Defines a family of algorithms, encapsulates each one, and makes them interchangeable at runtime.

**When to Use:**
- When you have multiple algorithms for a specific task
- When you want to avoid conditional statements for selecting algorithms
- When you need to isolate implementation details of an algorithm
- When many related classes differ only in their behavior

**Real-world Use Cases:**
- Payment processing (Credit Card, PayPal, Crypto)
- Sorting algorithms (QuickSort, MergeSort)
- Compression algorithms (ZIP, RAR, TAR)
- Route calculation (Fastest, Shortest, Scenic)

**Example:**
```typescript
const cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardPayment(...));
cart.checkout();

cart.setPaymentStrategy(new PayPalPayment(...));
cart.checkout();
```

**File:** `src/strategy.ts`

---

#### 9. Command Pattern

**Definition:** Encapsulates a request as an object, allowing you to parameterize clients with different requests, queue operations, and support undo/redo.

**When to Use:**
- When you need to parameterize objects with operations
- When you need to queue, schedule, or execute operations remotely
- When you need to implement reversible operations (undo/redo)
- When you want to structure a system around high-level operations

**Real-world Use Cases:**
- Undo/Redo functionality in text editors
- Transactional behavior and logging
- Task scheduling and job queues
- GUI buttons and menu items
- Macro recording

**Example:**
```typescript
const editor = new TextEditor();
const manager = new CommandManager();

manager.executeCommand(new WriteCommand(editor, 'Hello'));
manager.executeCommand(new WriteCommand(editor, ' World'));
manager.undo(); // Removes ' World'
manager.redo(); // Adds ' World' back
```

**File:** `src/command.ts`

---

#### 10. Template Method Pattern

**Definition:** Defines the skeleton of an algorithm in a base class, letting subclasses override specific steps without changing the structure.

**When to Use:**
- When you have multiple classes with similar algorithms
- When you want to let clients extend only particular steps
- When you want to avoid code duplication
- When you need to control extension points

**Real-world Use Cases:**
- Data processing pipelines (read, process, write)
- Game AI behavior (evaluate, decide, execute)
- Document generation (header, content, footer)
- Testing frameworks (setup, execute, teardown)

**Example:**
```typescript
abstract class DataProcessor {
  process() {
    this.readData();
    this.validateData();
    this.processData();
    this.saveData();
  }

  protected abstract readData(): void;
  protected abstract processData(): void;
}

class CSVProcessor extends DataProcessor {
  protected readData() { /* CSV-specific */ }
  protected processData() { /* CSV-specific */ }
}
```

**File:** `src/template-method.ts`

---

## 💡 Usage Examples

### Running All Patterns

```bash
npm run dev
```

This will run demonstrations of all 10 patterns sequentially.

### Running a Specific Pattern

```bash
npm run dev factory      # Factory Pattern
npm run dev builder      # Builder Pattern
npm run dev observer     # Observer Pattern
npm run dev strategy     # Strategy Pattern
npm run dev singleton    # Singleton Pattern
npm run dev decorator    # Decorator Pattern
npm run dev adapter      # Adapter Pattern
npm run dev command      # Command Pattern
npm run dev template     # Template Method Pattern
npm run dev prototype    # Prototype Pattern
```

## 📋 When to Use Each Pattern

| Pattern | Primary Use Case | Complexity | Frequency of Use |
|---------|-----------------|------------|------------------|
| **Factory** | Object creation without specifying exact class | Low | Very High |
| **Builder** | Complex objects with many parameters | Medium | High |
| **Singleton** | Single instance throughout application | Low | Medium |
| **Prototype** | Cloning expensive-to-create objects | Medium | Medium |
| **Adapter** | Making incompatible interfaces work together | Low | High |
| **Decorator** | Adding responsibilities dynamically | Medium | High |
| **Observer** | One-to-many event notification | Medium | Very High |
| **Strategy** | Interchangeable algorithms | Low | Very High |
| **Command** | Encapsulating requests, undo/redo | Medium | Medium |
| **Template Method** | Defining algorithm skeleton | Low | High |

## ⭐ Best Practices

### General Guidelines

1. **Understand the Problem First**: Don't force a pattern where it doesn't fit
2. **Keep It Simple**: Use patterns to simplify code, not complicate it
3. **Favor Composition Over Inheritance**: Most patterns promote this principle
4. **Program to Interfaces**: Depend on abstractions, not concrete implementations
5. **Open/Closed Principle**: Open for extension, closed for modification

### Pattern-Specific Tips

**Factory Pattern:**
- Use when you have a family of related objects
- Consider Simple Factory before full Factory Method

**Builder Pattern:**
- Perfect for objects with 4+ optional parameters
- Make required parameters mandatory in constructor

**Singleton Pattern:**
- Use sparingly - consider dependency injection
- Ensure thread-safety in multi-threaded environments
- Avoid for objects that hold mutable state

**Observer Pattern:**
- Implement unsubscribe to prevent memory leaks
- Consider using weak references for observers
- Be careful with observer order dependencies

**Strategy Pattern:**
- Prefer this over long if/else or switch statements
- Great for unit testing - easy to mock strategies

**Decorator Pattern:**
- Keep decorators lightweight
- Ensure decorators implement the same interface
- Consider the order of decoration

**Command Pattern:**
- Perfect for implementing undo/redo
- Use queues for command scheduling
- Consider command logging for debugging

## 📚 Additional Resources

- **Design Patterns: Elements of Reusable Object-Oriented Software** by Gang of Four
- **Head First Design Patterns** by Freeman & Freeman
- **Refactoring Guru** - [refactoring.guru/design-patterns](https://refactoring.guru/design-patterns)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding!** 🚀

If you find this repository helpful, please consider giving it a ⭐!
