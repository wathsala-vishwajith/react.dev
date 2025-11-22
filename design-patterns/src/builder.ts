/**
 * BUILDER PATTERN
 *
 * Definition: Separates the construction of a complex object from its representation,
 * allowing the same construction process to create different representations.
 *
 * When to Use:
 * - When you need to create complex objects with many optional parameters
 * - When you want to avoid telescoping constructor anti-pattern
 * - When the construction process must allow different representations
 * - When you need step-by-step construction of objects
 *
 * Real-world Use Cases:
 * - Building complex queries (SQL, MongoDB)
 * - Creating HTTP requests with many optional parameters
 * - Constructing UI forms with various configurations
 * - Building emails with attachments, CC, BCC, etc.
 * - Creating game characters with multiple attributes
 */

// Product class
class Computer {
  constructor(
    public cpu: string,
    public ram: string,
    public storage: string,
    public gpu?: string,
    public os?: string,
    public wifi?: boolean,
    public bluetooth?: boolean,
    public webcam?: boolean
  ) {}

  displaySpecs(): void {
    console.log('\n💻 Computer Specifications:');
    console.log(`  CPU: ${this.cpu}`);
    console.log(`  RAM: ${this.ram}`);
    console.log(`  Storage: ${this.storage}`);
    if (this.gpu) console.log(`  GPU: ${this.gpu}`);
    if (this.os) console.log(`  OS: ${this.os}`);
    if (this.wifi) console.log(`  WiFi: Enabled`);
    if (this.bluetooth) console.log(`  Bluetooth: Enabled`);
    if (this.webcam) console.log(`  Webcam: Included`);
  }
}

// Builder class
class ComputerBuilder {
  private cpu: string = '';
  private ram: string = '';
  private storage: string = '';
  private gpu?: string;
  private os?: string;
  private wifi?: boolean;
  private bluetooth?: boolean;
  private webcam?: boolean;

  setCPU(cpu: string): ComputerBuilder {
    this.cpu = cpu;
    return this;
  }

  setRAM(ram: string): ComputerBuilder {
    this.ram = ram;
    return this;
  }

  setStorage(storage: string): ComputerBuilder {
    this.storage = storage;
    return this;
  }

  setGPU(gpu: string): ComputerBuilder {
    this.gpu = gpu;
    return this;
  }

  setOS(os: string): ComputerBuilder {
    this.os = os;
    return this;
  }

  setWiFi(enabled: boolean): ComputerBuilder {
    this.wifi = enabled;
    return this;
  }

  setBluetooth(enabled: boolean): ComputerBuilder {
    this.bluetooth = enabled;
    return this;
  }

  setWebcam(included: boolean): ComputerBuilder {
    this.webcam = included;
    return this;
  }

  build(): Computer {
    if (!this.cpu || !this.ram || !this.storage) {
      throw new Error('CPU, RAM, and Storage are required');
    }
    return new Computer(
      this.cpu,
      this.ram,
      this.storage,
      this.gpu,
      this.os,
      this.wifi,
      this.bluetooth,
      this.webcam
    );
  }
}

// Practical Example 2: HTTP Request Builder
class HttpRequest {
  constructor(
    public url: string,
    public method: string,
    public headers: Record<string, string> = {},
    public body?: any,
    public timeout?: number,
    public retries?: number
  ) {}

  execute(): void {
    console.log('\n🌐 HTTP Request:');
    console.log(`  Method: ${this.method}`);
    console.log(`  URL: ${this.url}`);
    if (Object.keys(this.headers).length > 0) {
      console.log('  Headers:', this.headers);
    }
    if (this.body) {
      console.log('  Body:', this.body);
    }
    if (this.timeout) {
      console.log(`  Timeout: ${this.timeout}ms`);
    }
    if (this.retries) {
      console.log(`  Retries: ${this.retries}`);
    }
  }
}

class HttpRequestBuilder {
  private url: string = '';
  private method: string = 'GET';
  private headers: Record<string, string> = {};
  private body?: any;
  private timeout?: number;
  private retries?: number;

  setUrl(url: string): HttpRequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: string): HttpRequestBuilder {
    this.method = method;
    return this;
  }

  addHeader(key: string, value: string): HttpRequestBuilder {
    this.headers[key] = value;
    return this;
  }

  setBody(body: any): HttpRequestBuilder {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): HttpRequestBuilder {
    this.timeout = timeout;
    return this;
  }

  setRetries(retries: number): HttpRequestBuilder {
    this.retries = retries;
    return this;
  }

  build(): HttpRequest {
    if (!this.url) {
      throw new Error('URL is required');
    }
    return new HttpRequest(
      this.url,
      this.method,
      this.headers,
      this.body,
      this.timeout,
      this.retries
    );
  }
}

// Practical Example 3: Email Builder
class Email {
  constructor(
    public to: string[],
    public subject: string,
    public body: string,
    public cc?: string[],
    public bcc?: string[],
    public attachments?: string[],
    public priority?: 'low' | 'normal' | 'high'
  ) {}

  send(): void {
    console.log('\n📧 Email Details:');
    console.log(`  To: ${this.to.join(', ')}`);
    console.log(`  Subject: ${this.subject}`);
    console.log(`  Body: ${this.body}`);
    if (this.cc && this.cc.length > 0) {
      console.log(`  CC: ${this.cc.join(', ')}`);
    }
    if (this.bcc && this.bcc.length > 0) {
      console.log(`  BCC: ${this.bcc.join(', ')}`);
    }
    if (this.attachments && this.attachments.length > 0) {
      console.log(`  Attachments: ${this.attachments.join(', ')}`);
    }
    if (this.priority) {
      console.log(`  Priority: ${this.priority}`);
    }
    console.log('  Status: ✅ Sent');
  }
}

class EmailBuilder {
  private to: string[] = [];
  private subject: string = '';
  private body: string = '';
  private cc?: string[];
  private bcc?: string[];
  private attachments?: string[];
  private priority?: 'low' | 'normal' | 'high';

  addRecipient(email: string): EmailBuilder {
    this.to.push(email);
    return this;
  }

  setSubject(subject: string): EmailBuilder {
    this.subject = subject;
    return this;
  }

  setBody(body: string): EmailBuilder {
    this.body = body;
    return this;
  }

  addCC(email: string): EmailBuilder {
    if (!this.cc) this.cc = [];
    this.cc.push(email);
    return this;
  }

  addBCC(email: string): EmailBuilder {
    if (!this.bcc) this.bcc = [];
    this.bcc.push(email);
    return this;
  }

  addAttachment(filename: string): EmailBuilder {
    if (!this.attachments) this.attachments = [];
    this.attachments.push(filename);
    return this;
  }

  setPriority(priority: 'low' | 'normal' | 'high'): EmailBuilder {
    this.priority = priority;
    return this;
  }

  build(): Email {
    if (this.to.length === 0 || !this.subject || !this.body) {
      throw new Error('To, Subject, and Body are required');
    }
    return new Email(
      this.to,
      this.subject,
      this.body,
      this.cc,
      this.bcc,
      this.attachments,
      this.priority
    );
  }
}

// Demo function
export function demoBuilder(): void {
  console.log('\n=== BUILDER PATTERN DEMO ===\n');

  // Example 1: Building a Gaming Computer
  console.log('--- Building a Gaming Computer ---');
  const gamingPC = new ComputerBuilder()
    .setCPU('Intel i9-13900K')
    .setRAM('32GB DDR5')
    .setStorage('2TB NVMe SSD')
    .setGPU('NVIDIA RTX 4090')
    .setOS('Windows 11 Pro')
    .setWiFi(true)
    .setBluetooth(true)
    .setWebcam(true)
    .build();

  gamingPC.displaySpecs();

  // Example 2: Building a Basic Office Computer
  console.log('\n--- Building an Office Computer ---');
  const officePC = new ComputerBuilder()
    .setCPU('Intel i5-12400')
    .setRAM('16GB DDR4')
    .setStorage('512GB SSD')
    .setOS('Windows 11')
    .setWiFi(true)
    .build();

  officePC.displaySpecs();

  // Example 3: Building an HTTP Request
  console.log('\n--- Building HTTP Request ---');
  const request = new HttpRequestBuilder()
    .setUrl('https://api.example.com/users')
    .setMethod('POST')
    .addHeader('Content-Type', 'application/json')
    .addHeader('Authorization', 'Bearer token123')
    .setBody({ name: 'John Doe', email: 'john@example.com' })
    .setTimeout(5000)
    .setRetries(3)
    .build();

  request.execute();

  // Example 4: Building an Email
  console.log('\n--- Building Email ---');
  const email = new EmailBuilder()
    .addRecipient('user1@example.com')
    .addRecipient('user2@example.com')
    .setSubject('Quarterly Report')
    .setBody('Please find the attached quarterly report.')
    .addCC('manager@example.com')
    .addAttachment('Q4-2024-Report.pdf')
    .addAttachment('Financial-Summary.xlsx')
    .setPriority('high')
    .build();

  email.send();

  console.log('\n✅ Builder Pattern allows step-by-step construction of complex objects\n');
}
