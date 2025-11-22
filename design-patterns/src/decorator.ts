/**
 * DECORATOR PATTERN
 *
 * Definition: Attaches additional responsibilities to an object dynamically.
 * Decorators provide a flexible alternative to subclassing for extending functionality.
 *
 * When to Use:
 * - When you need to add responsibilities to objects dynamically and transparently
 * - When extension by subclassing is impractical or would result in too many subclasses
 * - When you want to add or remove responsibilities from objects at runtime
 * - When you need to combine several behaviors in various ways
 *
 * Real-world Use Cases:
 * - Adding features to GUI components (borders, scrollbars)
 * - Extending text formatting (bold, italic, underline)
 * - Adding middleware to HTTP requests/responses
 * - Enhancing coffee orders (milk, sugar, whipped cream)
 * - Adding encryption, compression to data streams
 */

// Component interface
interface Coffee {
  cost(): number;
  description(): string;
}

// Concrete Component
class SimpleCoffee implements Coffee {
  cost(): number {
    return 5;
  }

  description(): string {
    return 'Simple Coffee';
  }
}

// Base Decorator
abstract class CoffeeDecorator implements Coffee {
  constructor(protected coffee: Coffee) {}

  abstract cost(): number;
  abstract description(): string;
}

// Concrete Decorators
class MilkDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 1.5;
  }

  description(): string {
    return this.coffee.description() + ', Milk';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 0.5;
  }

  description(): string {
    return this.coffee.description() + ', Sugar';
  }
}

class WhippedCreamDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 2;
  }

  description(): string {
    return this.coffee.description() + ', Whipped Cream';
  }
}

class VanillaDecorator extends CoffeeDecorator {
  cost(): number {
    return this.coffee.cost() + 1;
  }

  description(): string {
    return this.coffee.description() + ', Vanilla';
  }
}

// Practical Example 2: Text Formatting
interface TextComponent {
  render(): string;
}

class PlainText implements TextComponent {
  constructor(private text: string) {}

  render(): string {
    return this.text;
  }
}

abstract class TextDecorator implements TextComponent {
  constructor(protected component: TextComponent) {}

  abstract render(): string;
}

class BoldDecorator extends TextDecorator {
  render(): string {
    return `<b>${this.component.render()}</b>`;
  }
}

class ItalicDecorator extends TextDecorator {
  render(): string {
    return `<i>${this.component.render()}</i>`;
  }
}

class UnderlineDecorator extends TextDecorator {
  render(): string {
    return `<u>${this.component.render()}</u>`;
  }
}

class ColorDecorator extends TextDecorator {
  constructor(component: TextComponent, private color: string) {
    super(component);
  }

  render(): string {
    return `<span style="color:${this.color}">${this.component.render()}</span>`;
  }
}

// Practical Example 3: Notification System
interface Notifier {
  send(message: string): void;
}

class BaseNotifier implements Notifier {
  send(message: string): void {
    console.log(`📧 Email: ${message}`);
  }
}

abstract class NotifierDecorator implements Notifier {
  constructor(protected notifier: Notifier) {}

  abstract send(message: string): void;
}

class SMSNotifierDecorator extends NotifierDecorator {
  send(message: string): void {
    this.notifier.send(message);
    console.log(`📱 SMS: ${message}`);
  }
}

class SlackNotifierDecorator extends NotifierDecorator {
  send(message: string): void {
    this.notifier.send(message);
    console.log(`💬 Slack: ${message}`);
  }
}

class FacebookNotifierDecorator extends NotifierDecorator {
  send(message: string): void {
    this.notifier.send(message);
    console.log(`📘 Facebook: ${message}`);
  }
}

// Practical Example 4: Data Stream Processing
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

class FileDataSource implements DataSource {
  private data: string = '';

  constructor(private filename: string) {}

  writeData(data: string): void {
    console.log(`💾 Writing to file ${this.filename}: ${data}`);
    this.data = data;
  }

  readData(): string {
    console.log(`📖 Reading from file ${this.filename}`);
    return this.data;
  }
}

abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}

  abstract writeData(data: string): void;
  abstract readData(): string;
}

class EncryptionDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    const encrypted = this.encrypt(data);
    console.log(`🔒 Encrypting data...`);
    this.wrappee.writeData(encrypted);
  }

  readData(): string {
    const data = this.wrappee.readData();
    console.log(`🔓 Decrypting data...`);
    return this.decrypt(data);
  }

  private encrypt(data: string): string {
    return Buffer.from(data).toString('base64');
  }

  private decrypt(data: string): string {
    return Buffer.from(data, 'base64').toString('utf-8');
  }
}

class CompressionDecorator extends DataSourceDecorator {
  writeData(data: string): void {
    const compressed = this.compress(data);
    console.log(`🗜️ Compressing data (${data.length} → ${compressed.length} bytes)...`);
    this.wrappee.writeData(compressed);
  }

  readData(): string {
    const data = this.wrappee.readData();
    console.log(`📦 Decompressing data...`);
    return this.decompress(data);
  }

  private compress(data: string): string {
    return data.split('').reverse().join('');
  }

  private decompress(data: string): string {
    return data.split('').reverse().join('');
  }
}

// Demo function
export function demoDecorator(): void {
  console.log('\n=== DECORATOR PATTERN DEMO ===\n');

  // Example 1: Coffee Shop
  console.log('--- Coffee Shop Example ---');
  let coffee: Coffee = new SimpleCoffee();
  console.log(`${coffee.description()} - $${coffee.cost()}`);

  coffee = new MilkDecorator(coffee);
  console.log(`${coffee.description()} - $${coffee.cost()}`);

  coffee = new SugarDecorator(coffee);
  console.log(`${coffee.description()} - $${coffee.cost()}`);

  coffee = new WhippedCreamDecorator(coffee);
  console.log(`${coffee.description()} - $${coffee.cost()}`);

  // Create another coffee with different decorators
  console.log('\nCreating a fancy vanilla coffee:');
  let fancyCoffee: Coffee = new SimpleCoffee();
  fancyCoffee = new VanillaDecorator(fancyCoffee);
  fancyCoffee = new MilkDecorator(fancyCoffee);
  fancyCoffee = new WhippedCreamDecorator(fancyCoffee);
  console.log(`${fancyCoffee.description()} - $${fancyCoffee.cost()}`);

  // Example 2: Text Formatting
  console.log('\n--- Text Formatting Example ---');
  let text: TextComponent = new PlainText('Hello World');
  console.log('Plain:', text.render());

  text = new BoldDecorator(text);
  console.log('Bold:', text.render());

  text = new ItalicDecorator(text);
  console.log('Bold + Italic:', text.render());

  text = new UnderlineDecorator(text);
  console.log('Bold + Italic + Underline:', text.render());

  let coloredText: TextComponent = new PlainText('Colorful Text');
  coloredText = new ColorDecorator(coloredText, 'red');
  coloredText = new BoldDecorator(coloredText);
  console.log('Colored + Bold:', coloredText.render());

  // Example 3: Notification System
  console.log('\n--- Notification System Example ---');
  let notifier: Notifier = new BaseNotifier();
  console.log('Sending via email only:');
  notifier.send('Server is down!');

  console.log('\nSending via email + SMS:');
  notifier = new SMSNotifierDecorator(notifier);
  notifier.send('Server is down!');

  console.log('\nSending via email + SMS + Slack:');
  notifier = new SlackNotifierDecorator(notifier);
  notifier.send('Server is down!');

  console.log('\nSending via email + SMS + Slack + Facebook:');
  notifier = new FacebookNotifierDecorator(notifier);
  notifier.send('Server is down!');

  // Example 4: Data Stream Processing
  console.log('\n--- Data Stream Processing Example ---');
  let source: DataSource = new FileDataSource('data.txt');
  console.log('\nBasic file operations:');
  source.writeData('Hello, World!');
  console.log('Read:', source.readData());

  console.log('\nWith compression:');
  source = new CompressionDecorator(new FileDataSource('compressed.txt'));
  source.writeData('Hello, World!');
  console.log('Read:', source.readData());

  console.log('\nWith encryption + compression:');
  source = new EncryptionDecorator(
    new CompressionDecorator(new FileDataSource('secure.txt'))
  );
  source.writeData('Sensitive Data');
  console.log('Read:', source.readData());

  console.log('\n✅ Decorator Pattern allows adding behaviors to objects dynamically\n');
}
