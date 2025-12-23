/**
 * ADAPTER PATTERN
 *
 * Definition: Converts the interface of a class into another interface that clients expect.
 * Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.
 *
 * When to Use:
 * - When you want to use an existing class but its interface doesn't match what you need
 * - When you need to create a reusable class that cooperates with unrelated classes
 * - When you need to use several existing subclasses but it's impractical to adapt their interface by subclassing
 * - When integrating third-party libraries with different interfaces
 *
 * Real-world Use Cases:
 * - Integrating legacy systems with modern code
 * - Working with third-party APIs that have different interfaces
 * - Supporting multiple payment gateways with different APIs
 * - Adapting different database drivers to a common interface
 * - Converting data formats (XML to JSON, etc.)
 */

// Target interface that client expects
interface MediaPlayer {
  play(filename: string): void;
}

// Adaptee 1: Old MP3 Player with incompatible interface
class LegacyMP3Player {
  playMP3(filename: string): void {
    console.log(`🎵 Playing MP3 file: ${filename}`);
  }
}

// Adaptee 2: Old WAV Player with incompatible interface
class LegacyWAVPlayer {
  playWAV(filename: string): void {
    console.log(`🎵 Playing WAV file: ${filename}`);
  }
}

// Adaptee 3: Advanced Media Player with different interface
class AdvancedMediaPlayer {
  playVLC(filename: string): void {
    console.log(`🎬 Playing VLC file: ${filename}`);
  }

  playMP4(filename: string): void {
    console.log(`🎬 Playing MP4 file: ${filename}`);
  }
}

// Adapter for Legacy MP3 Player
class MP3Adapter implements MediaPlayer {
  private mp3Player: LegacyMP3Player;

  constructor() {
    this.mp3Player = new LegacyMP3Player();
  }

  play(filename: string): void {
    this.mp3Player.playMP3(filename);
  }
}

// Adapter for Legacy WAV Player
class WAVAdapter implements MediaPlayer {
  private wavPlayer: LegacyWAVPlayer;

  constructor() {
    this.wavPlayer = new LegacyWAVPlayer();
  }

  play(filename: string): void {
    this.wavPlayer.playWAV(filename);
  }
}

// Adapter for Advanced Media Player
class AdvancedMediaAdapter implements MediaPlayer {
  private advancedPlayer: AdvancedMediaPlayer;

  constructor() {
    this.advancedPlayer = new AdvancedMediaPlayer();
  }

  play(filename: string): void {
    const extension = filename.split('.').pop()?.toLowerCase();

    if (extension === 'vlc') {
      this.advancedPlayer.playVLC(filename);
    } else if (extension === 'mp4') {
      this.advancedPlayer.playMP4(filename);
    } else {
      console.log(`❌ Unsupported format: ${extension}`);
    }
  }
}

// Universal Media Player using adapters
class UniversalMediaPlayer implements MediaPlayer {
  play(filename: string): void {
    const extension = filename.split('.').pop()?.toLowerCase();

    let player: MediaPlayer;

    switch (extension) {
      case 'mp3':
        player = new MP3Adapter();
        break;
      case 'wav':
        player = new WAVAdapter();
        break;
      case 'vlc':
      case 'mp4':
        player = new AdvancedMediaAdapter();
        break;
      default:
        console.log(`❌ Unsupported format: ${extension}`);
        return;
    }

    player.play(filename);
  }
}

// Practical Example 2: Payment Gateway Adapter
interface PaymentProcessor {
  processPayment(amount: number, currency: string): void;
  refund(transactionId: string, amount: number): void;
}

// Stripe API (Third-party service with different interface)
class StripeAPI {
  createCharge(amountInCents: number, currencyCode: string): string {
    console.log(`💳 Stripe: Charging ${amountInCents / 100} ${currencyCode.toUpperCase()}`);
    return `stripe_txn_${Math.random().toString(36).substr(2, 9)}`;
  }

  createRefund(chargeId: string, amountInCents: number): void {
    console.log(`💳 Stripe: Refunding ${amountInCents / 100} for charge ${chargeId}`);
  }
}

// PayPal API (Third-party service with different interface)
class PayPalAPI {
  makePayment(dollarAmount: number, currencyType: string): string {
    console.log(`💰 PayPal: Processing payment of ${dollarAmount} ${currencyType}`);
    return `paypal_${Math.random().toString(36).substr(2, 9)}`;
  }

  initiateRefund(paymentId: string, refundAmount: number): void {
    console.log(`💰 PayPal: Refunding ${refundAmount} for payment ${paymentId}`);
  }
}

// Adapter for Stripe
class StripeAdapter implements PaymentProcessor {
  private stripe: StripeAPI;
  private lastTransactionId: string = '';

  constructor() {
    this.stripe = new StripeAPI();
  }

  processPayment(amount: number, currency: string): void {
    const amountInCents = Math.round(amount * 100);
    this.lastTransactionId = this.stripe.createCharge(amountInCents, currency);
  }

  refund(transactionId: string, amount: number): void {
    const amountInCents = Math.round(amount * 100);
    this.stripe.createRefund(transactionId, amountInCents);
  }
}

// Adapter for PayPal
class PayPalAdapter implements PaymentProcessor {
  private paypal: PayPalAPI;
  private lastTransactionId: string = '';

  constructor() {
    this.paypal = new PayPalAPI();
  }

  processPayment(amount: number, currency: string): void {
    this.lastTransactionId = this.paypal.makePayment(amount, currency);
  }

  refund(transactionId: string, amount: number): void {
    this.paypal.initiateRefund(transactionId, amount);
  }
}

// Practical Example 3: Temperature Adapter
interface TemperatureSensor {
  getTemperatureInCelsius(): number;
}

// Fahrenheit sensor (incompatible interface)
class FahrenheitSensor {
  getTemperature(): number {
    return 77; // 77°F
  }
}

// Kelvin sensor (incompatible interface)
class KelvinSensor {
  readTemperature(): number {
    return 298.15; // 298.15K
  }
}

// Adapter for Fahrenheit sensor
class FahrenheitAdapter implements TemperatureSensor {
  constructor(private sensor: FahrenheitSensor) {}

  getTemperatureInCelsius(): number {
    const fahrenheit = this.sensor.getTemperature();
    const celsius = ((fahrenheit - 32) * 5) / 9;
    return Math.round(celsius * 100) / 100;
  }
}

// Adapter for Kelvin sensor
class KelvinAdapter implements TemperatureSensor {
  constructor(private sensor: KelvinSensor) {}

  getTemperatureInCelsius(): number {
    const kelvin = this.sensor.readTemperature();
    const celsius = kelvin - 273.15;
    return Math.round(celsius * 100) / 100;
  }
}

// Weather monitoring system
class WeatherMonitoring {
  displayTemperature(sensor: TemperatureSensor): void {
    const celsius = sensor.getTemperatureInCelsius();
    console.log(`🌡️ Current temperature: ${celsius}°C`);
  }
}

// Demo function
export function demoAdapter(): void {
  console.log('\n=== ADAPTER PATTERN DEMO ===\n');

  // Example 1: Media Player
  console.log('--- Universal Media Player Example ---');
  const player = new UniversalMediaPlayer();

  player.play('song.mp3');
  player.play('audio.wav');
  player.play('movie.mp4');
  player.play('video.vlc');
  player.play('unsupported.xyz');

  // Example 2: Payment Processors
  console.log('\n--- Payment Gateway Adapter Example ---');

  console.log('\nUsing Stripe:');
  const stripeProcessor: PaymentProcessor = new StripeAdapter();
  stripeProcessor.processPayment(99.99, 'USD');
  stripeProcessor.refund('stripe_txn_123', 50.00);

  console.log('\nUsing PayPal:');
  const paypalProcessor: PaymentProcessor = new PayPalAdapter();
  paypalProcessor.processPayment(149.99, 'EUR');
  paypalProcessor.refund('paypal_456', 75.00);

  // Example 3: Temperature Sensors
  console.log('\n--- Temperature Sensor Adapter Example ---');
  const weatherSystem = new WeatherMonitoring();

  const fahrenheitSensor = new FahrenheitSensor();
  const fahrenheitAdapter = new FahrenheitAdapter(fahrenheitSensor);

  const kelvinSensor = new KelvinSensor();
  const kelvinAdapter = new KelvinAdapter(kelvinSensor);

  console.log('\nFahrenheit sensor (77°F):');
  weatherSystem.displayTemperature(fahrenheitAdapter);

  console.log('\nKelvin sensor (298.15K):');
  weatherSystem.displayTemperature(kelvinAdapter);

  // Example 4: Multiple payment processors in a checkout system
  console.log('\n--- E-commerce Checkout Example ---');

  class CheckoutService {
    constructor(private paymentProcessor: PaymentProcessor) {}

    checkout(amount: number): void {
      console.log(`\n🛒 Processing checkout for $${amount}...`);
      this.paymentProcessor.processPayment(amount, 'USD');
      console.log('✅ Checkout completed successfully');
    }
  }

  const checkoutWithStripe = new CheckoutService(new StripeAdapter());
  checkoutWithStripe.checkout(299.99);

  const checkoutWithPayPal = new CheckoutService(new PayPalAdapter());
  checkoutWithPayPal.checkout(199.99);

  console.log('\n✅ Adapter Pattern allows incompatible interfaces to work together\n');
}
