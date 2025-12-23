/**
 * SINGLETON PATTERN
 *
 * Definition: Ensures a class has only one instance and provides a global point of access to it.
 *
 * When to Use:
 * - When exactly one instance of a class is needed throughout the application
 * - When you need strict control over global variables
 * - When the single instance should be extensible by subclassing
 * - When you want to ensure thread-safe access to a shared resource
 *
 * Real-world Use Cases:
 * - Database connections
 * - Configuration managers
 * - Logger services
 * - Cache managers
 * - Thread pools
 * - Application state managers
 *
 * Note: While Singleton is useful, it should be used sparingly as it can make
 * testing difficult and introduces global state. Consider dependency injection
 * as an alternative when possible.
 */

// Example 1: Database Connection Singleton
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionString: string;
  private isConnected: boolean = false;

  private constructor() {
    this.connectionString = 'mongodb://localhost:27017/myapp';
    console.log('🔌 Initializing database connection...');
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public connect(): void {
    if (!this.isConnected) {
      console.log(`📊 Connecting to database: ${this.connectionString}`);
      this.isConnected = true;
      console.log('✅ Database connected successfully');
    } else {
      console.log('ℹ️ Already connected to database');
    }
  }

  public disconnect(): void {
    if (this.isConnected) {
      console.log('🔌 Disconnecting from database...');
      this.isConnected = false;
      console.log('✅ Database disconnected');
    }
  }

  public query(sql: string): void {
    if (this.isConnected) {
      console.log(`🔍 Executing query: ${sql}`);
    } else {
      console.log('❌ Cannot execute query: Not connected to database');
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Example 2: Configuration Manager Singleton
interface AppConfig {
  apiUrl: string;
  apiKey: string;
  environment: 'development' | 'staging' | 'production';
  maxRetries: number;
  timeout: number;
}

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: AppConfig;

  private constructor() {
    console.log('⚙️ Initializing Configuration Manager...');
    this.config = {
      apiUrl: 'https://api.example.com',
      apiKey: 'default-api-key',
      environment: 'development',
      maxRetries: 3,
      timeout: 5000
    };
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('✅ Configuration updated:', updates);
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
    console.log(`✅ Updated ${key}:`, value);
  }
}

// Example 3: Logger Singleton
enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

class Logger {
  private static instance: Logger;
  private logs: Array<{ level: LogLevel; message: string; timestamp: Date }> = [];

  private constructor() {
    console.log('📝 Logger initialized');
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: LogLevel, message: string): void {
    const logEntry = {
      level,
      message,
      timestamp: new Date()
    };
    this.logs.push(logEntry);

    const emoji = {
      [LogLevel.DEBUG]: '🐛',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌'
    };

    console.log(
      `${emoji[level]} [${level}] ${logEntry.timestamp.toISOString()} - ${message}`
    );
  }

  public debug(message: string): void {
    this.log(LogLevel.DEBUG, message);
  }

  public info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public warn(message: string): void {
    this.log(LogLevel.WARN, message);
  }

  public error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }

  public getLogs(): typeof this.logs {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    console.log('🗑️ Logs cleared');
  }
}

// Example 4: Cache Manager Singleton
class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();

  private constructor() {
    console.log('💾 Cache Manager initialized');
    this.startCleanupInterval();
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set(key: string, value: any, ttl: number = 60000): void {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
    console.log(`💾 Cached "${key}" with TTL ${ttl}ms`);
  }

  public get(key: string): any | null {
    const item = this.cache.get(key);

    if (!item) {
      console.log(`❌ Cache miss for "${key}"`);
      return null;
    }

    if (Date.now() > item.expiresAt) {
      console.log(`⏰ Cache expired for "${key}"`);
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache hit for "${key}"`);
    return item.value;
  }

  public has(key: string): boolean {
    return this.cache.has(key) && Date.now() <= this.cache.get(key)!.expiresAt;
  }

  public delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`🗑️ Deleted "${key}" from cache`);
    }
    return deleted;
  }

  public clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  public getSize(): number {
    return this.cache.size;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      for (const [key, item] of this.cache.entries()) {
        if (now > item.expiresAt) {
          this.cache.delete(key);
          cleaned++;
        }
      }
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
      }
    }, 60000);
  }
}

// Demo function
export function demoSingleton(): void {
  console.log('\n=== SINGLETON PATTERN DEMO ===\n');

  // Example 1: Database Connection
  console.log('--- Database Connection Singleton ---');
  const db1 = DatabaseConnection.getInstance();
  const db2 = DatabaseConnection.getInstance();

  console.log('Are db1 and db2 the same instance?', db1 === db2);

  db1.connect();
  db1.query('SELECT * FROM users');

  // db2 is the same instance, so it's already connected
  db2.query('SELECT * FROM products');
  db2.disconnect();

  // Example 2: Configuration Manager
  console.log('\n--- Configuration Manager Singleton ---');
  const config1 = ConfigurationManager.getInstance();
  const config2 = ConfigurationManager.getInstance();

  console.log('Are config1 and config2 the same instance?', config1 === config2);

  console.log('Current API URL:', config1.get('apiUrl'));
  config1.set('environment', 'production');
  console.log('Environment from config2:', config2.get('environment'));

  config2.updateConfig({
    apiUrl: 'https://api.production.com',
    apiKey: 'prod-api-key-12345'
  });

  console.log('Updated config:', config1.getConfig());

  // Example 3: Logger
  console.log('\n--- Logger Singleton ---');
  const logger1 = Logger.getInstance();
  const logger2 = Logger.getInstance();

  console.log('Are logger1 and logger2 the same instance?', logger1 === logger2);

  logger1.info('Application started');
  logger2.debug('Debugging information');
  logger1.warn('This is a warning');
  logger2.error('An error occurred');

  console.log('\nTotal logs:', logger1.getLogs().length);

  // Example 4: Cache Manager
  console.log('\n--- Cache Manager Singleton ---');
  const cache1 = CacheManager.getInstance();
  const cache2 = CacheManager.getInstance();

  console.log('Are cache1 and cache2 the same instance?', cache1 === cache2);

  cache1.set('user:123', { name: 'John Doe', email: 'john@example.com' }, 5000);
  cache1.set('product:456', { name: 'Laptop', price: 999.99 }, 10000);

  const user = cache2.get('user:123');
  console.log('Retrieved from cache:', user);

  console.log('Cache size:', cache1.getSize());

  console.log('\n✅ Singleton Pattern ensures only one instance exists throughout the application\n');
}
