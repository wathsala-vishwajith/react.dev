/**
 * STRATEGY PATTERN
 *
 * Definition: Defines a family of algorithms, encapsulates each one, and makes them
 * interchangeable. Strategy lets the algorithm vary independently from clients that use it.
 *
 * When to Use:
 * - When you have multiple algorithms for a specific task and want to switch between them
 * - When you want to avoid conditional statements for selecting algorithms
 * - When you need to isolate the implementation details of an algorithm
 * - When many related classes differ only in their behavior
 *
 * Real-world Use Cases:
 * - Payment processing (Credit Card, PayPal, Cryptocurrency)
 * - Sorting algorithms (QuickSort, MergeSort, BubbleSort)
 * - Compression algorithms (ZIP, RAR, TAR)
 * - Route calculation (Fastest, Shortest, Scenic)
 * - Pricing strategies (Regular, Premium, Discount)
 */

// Strategy Interface
interface PaymentStrategy {
  pay(amount: number): void;
  validate(): boolean;
}

// Concrete Strategies
class CreditCardPayment implements PaymentStrategy {
  constructor(
    private cardNumber: string,
    private cvv: string,
    private expiryDate: string
  ) {}

  validate(): boolean {
    console.log('💳 Validating credit card details...');
    return this.cardNumber.length === 16 && this.cvv.length === 3;
  }

  pay(amount: number): void {
    if (this.validate()) {
      console.log(`💳 Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
    } else {
      console.log('❌ Invalid credit card details');
    }
  }
}

class PayPalPayment implements PaymentStrategy {
  constructor(private email: string, private password: string) {}

  validate(): boolean {
    console.log('🅿️ Validating PayPal credentials...');
    return this.email.includes('@') && this.password.length > 0;
  }

  pay(amount: number): void {
    if (this.validate()) {
      console.log(`🅿️ Paid $${amount} using PayPal account: ${this.email}`);
    } else {
      console.log('❌ Invalid PayPal credentials');
    }
  }
}

class CryptocurrencyPayment implements PaymentStrategy {
  constructor(private walletAddress: string, private cryptoType: string) {}

  validate(): boolean {
    console.log('₿ Validating cryptocurrency wallet...');
    return this.walletAddress.length > 20;
  }

  pay(amount: number): void {
    if (this.validate()) {
      console.log(`₿ Paid $${amount} using ${this.cryptoType} wallet: ${this.walletAddress.slice(0, 10)}...`);
    } else {
      console.log('❌ Invalid wallet address');
    }
  }
}

// Context class
class ShoppingCart {
  private items: { name: string; price: number }[] = [];
  private paymentStrategy?: PaymentStrategy;

  addItem(name: string, price: number): void {
    this.items.push({ name, price });
    console.log(`📦 Added "${name}" - $${price} to cart`);
  }

  setPaymentStrategy(strategy: PaymentStrategy): void {
    this.paymentStrategy = strategy;
  }

  checkout(): void {
    if (!this.paymentStrategy) {
      console.log('❌ Please select a payment method');
      return;
    }

    const total = this.items.reduce((sum, item) => sum + item.price, 0);
    console.log(`\n🛒 Cart Total: $${total}`);
    this.paymentStrategy.pay(total);
    this.items = [];
  }
}

// Practical Example 2: Sorting Strategy
interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('🫧 Using Bubble Sort...');
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('⚡ Using Quick Sort...');
    if (data.length <= 1) return data;

    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const middle = data.filter(x => x === pivot);
    const right = data.filter(x => x > pivot);

    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
}

class MergeSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('🔀 Using Merge Sort...');
    if (data.length <= 1) return data;

    const mid = Math.floor(data.length / 2);
    const left = this.sort(data.slice(0, mid));
    const right = this.sort(data.slice(mid));

    return this.merge(left, right);
  }

  private merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }
}

class DataSorter {
  private strategy?: SortStrategy;

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sortData(data: number[]): number[] {
    if (!this.strategy) {
      throw new Error('Sorting strategy not set');
    }
    return this.strategy.sort(data);
  }
}

// Practical Example 3: Compression Strategy
interface CompressionStrategy {
  compress(file: string): void;
}

class ZipCompression implements CompressionStrategy {
  compress(file: string): void {
    console.log(`📦 Compressing "${file}" using ZIP format...`);
    console.log('✅ Created: ' + file + '.zip');
  }
}

class RarCompression implements CompressionStrategy {
  compress(file: string): void {
    console.log(`📦 Compressing "${file}" using RAR format...`);
    console.log('✅ Created: ' + file + '.rar');
  }
}

class TarCompression implements CompressionStrategy {
  compress(file: string): void {
    console.log(`📦 Compressing "${file}" using TAR format...`);
    console.log('✅ Created: ' + file + '.tar.gz');
  }
}

class FileCompressor {
  private strategy?: CompressionStrategy;

  setStrategy(strategy: CompressionStrategy): void {
    this.strategy = strategy;
  }

  compressFile(filename: string): void {
    if (!this.strategy) {
      console.log('❌ Compression strategy not set');
      return;
    }
    this.strategy.compress(filename);
  }
}

// Demo function
export function demoStrategy(): void {
  console.log('\n=== STRATEGY PATTERN DEMO ===\n');

  // Example 1: Payment Strategy
  console.log('--- Payment Strategy Example ---');
  const cart = new ShoppingCart();
  cart.addItem('Laptop', 999.99);
  cart.addItem('Mouse', 29.99);
  cart.addItem('Keyboard', 79.99);

  // Pay with Credit Card
  console.log('\nPayment Method: Credit Card');
  cart.setPaymentStrategy(new CreditCardPayment('1234567890123456', '123', '12/25'));
  cart.checkout();

  // Add more items and pay with PayPal
  cart.addItem('Monitor', 299.99);
  cart.addItem('Headphones', 149.99);
  console.log('\nPayment Method: PayPal');
  cart.setPaymentStrategy(new PayPalPayment('user@example.com', 'password123'));
  cart.checkout();

  // Add more items and pay with Cryptocurrency
  cart.addItem('Webcam', 89.99);
  console.log('\nPayment Method: Cryptocurrency');
  cart.setPaymentStrategy(new CryptocurrencyPayment('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'Bitcoin'));
  cart.checkout();

  // Example 2: Sorting Strategy
  console.log('\n--- Sorting Strategy Example ---');
  const data = [64, 34, 25, 12, 22, 11, 90];
  console.log('Original data:', data);

  const sorter = new DataSorter();

  sorter.setStrategy(new BubbleSort());
  console.log('Bubble Sort Result:', sorter.sortData(data));

  sorter.setStrategy(new QuickSort());
  console.log('Quick Sort Result:', sorter.sortData(data));

  sorter.setStrategy(new MergeSort());
  console.log('Merge Sort Result:', sorter.sortData(data));

  // Example 3: Compression Strategy
  console.log('\n--- Compression Strategy Example ---');
  const compressor = new FileCompressor();

  compressor.setStrategy(new ZipCompression());
  compressor.compressFile('document.pdf');

  compressor.setStrategy(new RarCompression());
  compressor.compressFile('photos.jpg');

  compressor.setStrategy(new TarCompression());
  compressor.compressFile('project-files');

  console.log('\n✅ Strategy Pattern allows switching algorithms at runtime\n');
}
