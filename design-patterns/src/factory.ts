/**
 * FACTORY PATTERN
 *
 * Definition: Creates objects without exposing the creation logic to the client.
 * The factory method defines an interface for creating an object, but lets subclasses
 * decide which class to instantiate.
 *
 * When to Use:
 * - When you don't know beforehand the exact types and dependencies of objects your code should work with
 * - When you want to provide users of your library/framework with a way to extend its internal components
 * - When you want to save system resources by reusing existing objects instead of rebuilding them
 * - When you need to centralize class selection logic
 *
 * Real-world Use Cases:
 * - UI component libraries (different button types)
 * - Database connection factories (MySQL, PostgreSQL, MongoDB)
 * - Document creation (PDF, Word, Excel)
 * - Payment processing (Credit Card, PayPal, Stripe)
 */

// Product interface
interface Vehicle {
  type: string;
  wheels: number;
  capacity: number;
  drive(): void;
  park(): void;
}

// Concrete Products
class Car implements Vehicle {
  type = 'Car';
  wheels = 4;
  capacity = 5;

  drive(): void {
    console.log(`🚗 Driving a ${this.type} with ${this.wheels} wheels`);
  }

  park(): void {
    console.log(`Parking the ${this.type} in a standard parking spot`);
  }
}

class Truck implements Vehicle {
  type = 'Truck';
  wheels = 6;
  capacity = 2;

  drive(): void {
    console.log(`🚚 Driving a ${this.type} with ${this.wheels} wheels`);
  }

  park(): void {
    console.log(`Parking the ${this.type} in a large parking area`);
  }
}

class Motorcycle implements Vehicle {
  type = 'Motorcycle';
  wheels = 2;
  capacity = 2;

  drive(): void {
    console.log(`🏍️ Riding a ${this.type} with ${this.wheels} wheels`);
  }

  park(): void {
    console.log(`Parking the ${this.type} in a compact spot`);
  }
}

// Factory Class
class VehicleFactory {
  static createVehicle(vehicleType: string): Vehicle {
    switch (vehicleType.toLowerCase()) {
      case 'car':
        return new Car();
      case 'truck':
        return new Truck();
      case 'motorcycle':
        return new Motorcycle();
      default:
        throw new Error(`Vehicle type "${vehicleType}" is not supported`);
    }
  }
}

// Practical Example 2: Notification System
interface Notification {
  send(message: string, recipient: string): void;
}

class EmailNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`📧 Sending email to ${recipient}: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`📱 Sending SMS to ${recipient}: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`🔔 Sending push notification to ${recipient}: ${message}`);
  }
}

class NotificationFactory {
  static createNotification(type: string): Notification {
    switch (type.toLowerCase()) {
      case 'email':
        return new EmailNotification();
      case 'sms':
        return new SMSNotification();
      case 'push':
        return new PushNotification();
      default:
        throw new Error(`Notification type "${type}" is not supported`);
    }
  }
}

// Demo function
export function demoFactory(): void {
  console.log('\n=== FACTORY PATTERN DEMO ===\n');

  // Example 1: Vehicle Factory
  console.log('--- Vehicle Factory Example ---');
  const car = VehicleFactory.createVehicle('car');
  car.drive();
  car.park();

  const truck = VehicleFactory.createVehicle('truck');
  truck.drive();
  truck.park();

  const motorcycle = VehicleFactory.createVehicle('motorcycle');
  motorcycle.drive();
  motorcycle.park();

  // Example 2: Notification Factory
  console.log('\n--- Notification Factory Example ---');
  const emailNotif = NotificationFactory.createNotification('email');
  emailNotif.send('Welcome to our service!', 'user@example.com');

  const smsNotif = NotificationFactory.createNotification('sms');
  smsNotif.send('Your OTP is 123456', '+1234567890');

  const pushNotif = NotificationFactory.createNotification('push');
  pushNotif.send('You have a new message', 'user123');

  console.log('\n✅ Factory Pattern allows creating objects without specifying exact classes\n');
}
