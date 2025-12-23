/**
 * PROTOTYPE PATTERN
 *
 * Definition: Creates new objects by cloning existing objects (prototypes) rather than
 * creating new instances from scratch. This pattern is used when the cost of creating
 * a new instance is more expensive than copying an existing one.
 *
 * When to Use:
 * - When creating an object is expensive (e.g., requires database queries or complex calculations)
 * - When you need to avoid subclasses of an object creator
 * - When classes to instantiate are specified at runtime
 * - When you want to hide the complexity of creating new instances from the client
 * - When you need to create objects that are similar to existing objects
 *
 * Real-world Use Cases:
 * - Cloning complex object graphs
 * - Creating game objects (enemies, items) from templates
 * - Document templates and form templates
 * - Configuration presets
 * - Prototypal inheritance in JavaScript
 */

// Prototype interface
interface Prototype<T> {
  clone(): T;
}

// Practical Example 1: Game Character System
class GameCharacter implements Prototype<GameCharacter> {
  constructor(
    public name: string,
    public level: number,
    public health: number,
    public mana: number,
    public equipment: string[],
    public skills: string[],
    public position: { x: number; y: number }
  ) {}

  clone(): GameCharacter {
    // Deep clone to avoid reference issues
    return new GameCharacter(
      this.name,
      this.level,
      this.health,
      this.mana,
      [...this.equipment],
      [...this.skills],
      { ...this.position }
    );
  }

  display(): void {
    console.log(`\n🎮 Character: ${this.name}`);
    console.log(`   Level: ${this.level}`);
    console.log(`   Health: ${this.health}`);
    console.log(`   Mana: ${this.mana}`);
    console.log(`   Equipment: ${this.equipment.join(', ')}`);
    console.log(`   Skills: ${this.skills.join(', ')}`);
    console.log(`   Position: (${this.position.x}, ${this.position.y})`);
  }
}

// Character Registry for storing prototypes
class CharacterRegistry {
  private characters: Map<string, GameCharacter> = new Map();

  addCharacter(key: string, character: GameCharacter): void {
    this.characters.set(key, character);
    console.log(`✅ Added character template: ${key}`);
  }

  getCharacter(key: string): GameCharacter | null {
    const prototype = this.characters.get(key);
    return prototype ? prototype.clone() : null;
  }
}

// Practical Example 2: Document Templates
interface Document extends Prototype<Document> {
  title: string;
  content: string;
  metadata: {
    author: string;
    createdAt: Date;
    tags: string[];
  };
}

class TextDocument implements Document {
  constructor(
    public title: string,
    public content: string,
    public metadata: {
      author: string;
      createdAt: Date;
      tags: string[];
    }
  ) {}

  clone(): TextDocument {
    return new TextDocument(
      this.title,
      this.content,
      {
        author: this.metadata.author,
        createdAt: new Date(this.metadata.createdAt),
        tags: [...this.metadata.tags]
      }
    );
  }

  display(): void {
    console.log(`\n📄 Document: ${this.title}`);
    console.log(`   Author: ${this.metadata.author}`);
    console.log(`   Created: ${this.metadata.createdAt.toLocaleDateString()}`);
    console.log(`   Tags: ${this.metadata.tags.join(', ')}`);
    console.log(`   Content: ${this.content.substring(0, 50)}...`);
  }
}

class DocumentRegistry {
  private templates: Map<string, Document> = new Map();

  registerTemplate(name: string, document: Document): void {
    this.templates.set(name, document);
    console.log(`✅ Registered template: ${name}`);
  }

  createFromTemplate(name: string): Document | null {
    const template = this.templates.get(name);
    return template ? template.clone() : null;
  }
}

// Practical Example 3: UI Component Prototypes
interface UIComponent extends Prototype<UIComponent> {
  render(): void;
}

class Button implements UIComponent {
  constructor(
    public text: string,
    public width: number,
    public height: number,
    public backgroundColor: string,
    public textColor: string,
    public borderRadius: number,
    public styles: Record<string, string>
  ) {}

  clone(): Button {
    return new Button(
      this.text,
      this.width,
      this.height,
      this.backgroundColor,
      this.textColor,
      this.borderRadius,
      { ...this.styles }
    );
  }

  render(): void {
    console.log(`\n🔘 Button: "${this.text}"`);
    console.log(`   Size: ${this.width}x${this.height}px`);
    console.log(`   Colors: ${this.backgroundColor} / ${this.textColor}`);
    console.log(`   Border Radius: ${this.borderRadius}px`);
    console.log(`   Styles:`, this.styles);
  }
}

class Card implements UIComponent {
  constructor(
    public title: string,
    public description: string,
    public imageUrl: string,
    public width: number,
    public padding: number,
    public shadow: string
  ) {}

  clone(): Card {
    return new Card(
      this.title,
      this.description,
      this.imageUrl,
      this.width,
      this.padding,
      this.shadow
    );
  }

  render(): void {
    console.log(`\n📇 Card: "${this.title}"`);
    console.log(`   Description: ${this.description}`);
    console.log(`   Image: ${this.imageUrl}`);
    console.log(`   Width: ${this.width}px`);
    console.log(`   Padding: ${this.padding}px`);
    console.log(`   Shadow: ${this.shadow}`);
  }
}

class ComponentFactory {
  private prototypes: Map<string, UIComponent> = new Map();

  registerPrototype(name: string, component: UIComponent): void {
    this.prototypes.set(name, component);
    console.log(`✅ Registered component prototype: ${name}`);
  }

  create(name: string): UIComponent | null {
    const prototype = this.prototypes.get(name);
    return prototype ? prototype.clone() : null;
  }
}

// Practical Example 4: Database Configuration Cloning
class DatabaseConfig implements Prototype<DatabaseConfig> {
  constructor(
    public host: string,
    public port: number,
    public database: string,
    public username: string,
    public password: string,
    public options: {
      ssl: boolean;
      poolSize: number;
      timeout: number;
      retries: number;
    }
  ) {}

  clone(): DatabaseConfig {
    return new DatabaseConfig(
      this.host,
      this.port,
      this.database,
      this.username,
      this.password,
      { ...this.options }
    );
  }

  display(): void {
    console.log(`\n💾 Database Configuration`);
    console.log(`   Host: ${this.host}:${this.port}`);
    console.log(`   Database: ${this.database}`);
    console.log(`   User: ${this.username}`);
    console.log(`   SSL: ${this.options.ssl}`);
    console.log(`   Pool Size: ${this.options.poolSize}`);
    console.log(`   Timeout: ${this.options.timeout}ms`);
    console.log(`   Retries: ${this.options.retries}`);
  }
}

// Demo function
export function demoPrototype(): void {
  console.log('\n=== PROTOTYPE PATTERN DEMO ===\n');

  // Example 1: Game Character Cloning
  console.log('--- Game Character System ---');

  const registry = new CharacterRegistry();

  // Create base warrior template
  const baseWarrior = new GameCharacter(
    'Warrior',
    10,
    1000,
    100,
    ['Sword', 'Shield', 'Helmet'],
    ['Slash', 'Block', 'Charge'],
    { x: 0, y: 0 }
  );

  // Create base mage template
  const baseMage = new GameCharacter(
    'Mage',
    10,
    500,
    1000,
    ['Staff', 'Robe', 'Ring'],
    ['Fireball', 'Ice Storm', 'Teleport'],
    { x: 0, y: 0 }
  );

  registry.addCharacter('warrior', baseWarrior);
  registry.addCharacter('mage', baseMage);

  console.log('\nCloning warriors:');
  const warrior1 = registry.getCharacter('warrior')!;
  warrior1.name = 'Aragorn';
  warrior1.position = { x: 100, y: 200 };

  const warrior2 = registry.getCharacter('warrior')!;
  warrior2.name = 'Boromir';
  warrior2.level = 12;
  warrior2.position = { x: 150, y: 250 };

  warrior1.display();
  warrior2.display();

  console.log('\nCloning mages:');
  const mage1 = registry.getCharacter('mage')!;
  mage1.name = 'Gandalf';
  mage1.level = 20;
  mage1.position = { x: 50, y: 100 };

  mage1.display();

  // Example 2: Document Templates
  console.log('\n--- Document Templates ---');

  const docRegistry = new DocumentRegistry();

  const letterTemplate = new TextDocument(
    'Formal Letter Template',
    'Dear [Recipient],\n\n[Content]\n\nSincerely,\n[Sender]',
    {
      author: 'Template System',
      createdAt: new Date(),
      tags: ['letter', 'formal', 'template']
    }
  );

  const reportTemplate = new TextDocument(
    'Monthly Report Template',
    'Monthly Report - [Month]\n\nExecutive Summary:\n[Summary]\n\nDetails:\n[Details]',
    {
      author: 'Template System',
      createdAt: new Date(),
      tags: ['report', 'monthly', 'template']
    }
  );

  docRegistry.registerTemplate('formal-letter', letterTemplate);
  docRegistry.registerTemplate('monthly-report', reportTemplate);

  console.log('\nCreating documents from templates:');
  const letter1 = docRegistry.createFromTemplate('formal-letter') as TextDocument;
  letter1.title = 'Letter to Client';
  letter1.metadata.author = 'John Doe';
  letter1.display();

  const report1 = docRegistry.createFromTemplate('monthly-report') as TextDocument;
  report1.title = 'Q4 2024 Report';
  report1.metadata.author = 'Jane Smith';
  report1.metadata.tags.push('Q4', '2024');
  report1.display();

  // Example 3: UI Component Factory
  console.log('\n--- UI Component Prototypes ---');

  const componentFactory = new ComponentFactory();

  const primaryButton = new Button(
    'Click Me',
    120,
    40,
    '#007bff',
    '#ffffff',
    4,
    { fontWeight: 'bold', fontSize: '14px' }
  );

  const productCard = new Card(
    'Product Name',
    'Product description goes here',
    '/images/product.jpg',
    300,
    16,
    '0 2px 8px rgba(0,0,0,0.1)'
  );

  componentFactory.registerPrototype('primary-button', primaryButton);
  componentFactory.registerPrototype('product-card', productCard);

  console.log('\nCreating components from prototypes:');
  const submitButton = componentFactory.create('primary-button') as Button;
  submitButton.text = 'Submit';
  submitButton.backgroundColor = '#28a745';
  submitButton.render();

  const cancelButton = componentFactory.create('primary-button') as Button;
  cancelButton.text = 'Cancel';
  cancelButton.backgroundColor = '#dc3545';
  cancelButton.render();

  const card1 = componentFactory.create('product-card') as Card;
  card1.title = 'Laptop';
  card1.description = 'High-performance laptop for developers';
  card1.render();

  // Example 4: Database Configuration
  console.log('\n--- Database Configuration Cloning ---');

  const productionConfig = new DatabaseConfig(
    'prod-db.example.com',
    5432,
    'production',
    'prod_user',
    'prod_password',
    {
      ssl: true,
      poolSize: 20,
      timeout: 30000,
      retries: 3
    }
  );

  console.log('\nBase production config:');
  productionConfig.display();

  console.log('\nCloning for different regions:');
  const usConfig = productionConfig.clone();
  usConfig.host = 'us-prod-db.example.com';
  usConfig.database = 'production_us';
  usConfig.display();

  const euConfig = productionConfig.clone();
  euConfig.host = 'eu-prod-db.example.com';
  euConfig.database = 'production_eu';
  euConfig.display();

  console.log('\n✅ Prototype Pattern creates objects by cloning existing prototypes\n');
}
