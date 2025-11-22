/**
 * OBSERVER PATTERN
 *
 * Definition: Defines a one-to-many dependency between objects so that when one object
 * changes state, all its dependents are notified and updated automatically.
 *
 * When to Use:
 * - When changes to one object require changing others, and you don't know how many objects need to be changed
 * - When an object should be able to notify other objects without making assumptions about who these objects are
 * - When you need to implement event handling systems
 * - When you want to achieve loose coupling between objects
 *
 * Real-world Use Cases:
 * - Event handling systems (DOM events, custom events)
 * - State management (Redux, MobX, Zustand)
 * - Real-time data updates (stock prices, chat messages)
 * - Newsletter/notification systems
 * - Model-View-Controller (MVC) architecture
 */

// Observer interface
interface Observer {
  update(data: any): void;
}

// Subject interface
interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

// Practical Example 1: Stock Price Monitoring System
class StockPrice implements Subject {
  private observers: Observer[] = [];
  private stockSymbol: string;
  private price: number;

  constructor(symbol: string, initialPrice: number) {
    this.stockSymbol = symbol;
    this.price = initialPrice;
  }

  attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      console.log('Observer already attached');
      return;
    }
    this.observers.push(observer);
    console.log(`✅ Observer attached to ${this.stockSymbol}`);
  }

  detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      console.log('Observer not found');
      return;
    }
    this.observers.splice(observerIndex, 1);
    console.log(`❌ Observer detached from ${this.stockSymbol}`);
  }

  notify(data: any): void {
    console.log(`📢 Notifying ${this.observers.length} observers about ${this.stockSymbol}...`);
    for (const observer of this.observers) {
      observer.update(data);
    }
  }

  setPrice(newPrice: number): void {
    console.log(`\n💹 ${this.stockSymbol} price changed: $${this.price} → $${newPrice}`);
    this.price = newPrice;
    this.notify({
      symbol: this.stockSymbol,
      price: newPrice,
      timestamp: new Date()
    });
  }

  getPrice(): number {
    return this.price;
  }
}

class MobileApp implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(data: any): void {
    console.log(`📱 ${this.name}: Stock ${data.symbol} is now $${data.price}`);
  }
}

class EmailAlert implements Observer {
  private email: string;

  constructor(email: string) {
    this.email = email;
  }

  update(data: any): void {
    console.log(`📧 Email to ${this.email}: ${data.symbol} price alert - $${data.price}`);
  }
}

class TradingBot implements Observer {
  private threshold: number;

  constructor(threshold: number) {
    this.threshold = threshold;
  }

  update(data: any): void {
    if (data.price > this.threshold) {
      console.log(`🤖 Trading Bot: Selling ${data.symbol} at $${data.price} (above threshold $${this.threshold})`);
    } else {
      console.log(`🤖 Trading Bot: Buying ${data.symbol} at $${data.price} (below threshold $${this.threshold})`);
    }
  }
}

// Practical Example 2: Newsletter Subscription System
class Newsletter implements Subject {
  private subscribers: Observer[] = [];
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  attach(observer: Observer): void {
    this.subscribers.push(observer);
    console.log(`✅ New subscriber added to ${this.name}`);
  }

  detach(observer: Observer): void {
    const index = this.subscribers.indexOf(observer);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
      console.log(`❌ Subscriber removed from ${this.name}`);
    }
  }

  notify(data: any): void {
    console.log(`📢 Sending newsletter to ${this.subscribers.length} subscribers...`);
    for (const subscriber of this.subscribers) {
      subscriber.update(data);
    }
  }

  publishArticle(title: string, content: string): void {
    console.log(`\n📰 Publishing new article: "${title}"`);
    this.notify({
      newsletter: this.name,
      title,
      content,
      publishedAt: new Date()
    });
  }
}

class EmailSubscriber implements Observer {
  constructor(private email: string) {}

  update(data: any): void {
    console.log(`📧 Email to ${this.email}: New article - "${data.title}"`);
  }
}

class SMSSubscriber implements Observer {
  constructor(private phone: string) {}

  update(data: any): void {
    console.log(`📱 SMS to ${this.phone}: New article published - "${data.title}"`);
  }
}

// Practical Example 3: Weather Station
class WeatherStation implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;
  private humidity: number = 0;
  private pressure: number = 0;

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }

  setMeasurements(temperature: number, humidity: number, pressure: number): void {
    console.log(`\n🌡️ Weather update: ${temperature}°C, ${humidity}% humidity, ${pressure} hPa`);
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;
    this.notify({
      temperature,
      humidity,
      pressure,
      timestamp: new Date()
    });
  }
}

class CurrentConditionsDisplay implements Observer {
  update(data: any): void {
    console.log(`📊 Current Conditions: ${data.temperature}°C, ${data.humidity}% humidity`);
  }
}

class StatisticsDisplay implements Observer {
  private temperatures: number[] = [];

  update(data: any): void {
    this.temperatures.push(data.temperature);
    const avg = this.temperatures.reduce((a, b) => a + b, 0) / this.temperatures.length;
    const max = Math.max(...this.temperatures);
    const min = Math.min(...this.temperatures);
    console.log(`📈 Statistics: Avg: ${avg.toFixed(1)}°C, Max: ${max}°C, Min: ${min}°C`);
  }
}

// Demo function
export function demoObserver(): void {
  console.log('\n=== OBSERVER PATTERN DEMO ===\n');

  // Example 1: Stock Price Monitoring
  console.log('--- Stock Price Monitoring System ---');
  const appleStock = new StockPrice('AAPL', 150.00);

  const mobileApp = new MobileApp('iPhone Trading App');
  const emailAlert = new EmailAlert('trader@example.com');
  const tradingBot = new TradingBot(175);

  appleStock.attach(mobileApp);
  appleStock.attach(emailAlert);
  appleStock.attach(tradingBot);

  appleStock.setPrice(165.50);
  appleStock.setPrice(180.00);

  // Example 2: Newsletter System
  console.log('\n--- Newsletter System ---');
  const techNewsletter = new Newsletter('Tech Weekly');

  const emailSub1 = new EmailSubscriber('user1@example.com');
  const emailSub2 = new EmailSubscriber('user2@example.com');
  const smsSub = new SMSSubscriber('+1234567890');

  techNewsletter.attach(emailSub1);
  techNewsletter.attach(emailSub2);
  techNewsletter.attach(smsSub);

  techNewsletter.publishArticle(
    'The Future of AI',
    'Artificial Intelligence is transforming industries...'
  );

  // Example 3: Weather Station
  console.log('\n--- Weather Station ---');
  const weatherStation = new WeatherStation();

  const currentDisplay = new CurrentConditionsDisplay();
  const statsDisplay = new StatisticsDisplay();

  weatherStation.attach(currentDisplay);
  weatherStation.attach(statsDisplay);

  weatherStation.setMeasurements(25, 65, 1013);
  weatherStation.setMeasurements(27, 70, 1012);
  weatherStation.setMeasurements(23, 60, 1014);

  console.log('\n✅ Observer Pattern allows objects to be notified of state changes automatically\n');
}
