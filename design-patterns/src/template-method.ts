/**
 * TEMPLATE METHOD PATTERN
 *
 * Definition: Defines the skeleton of an algorithm in a base class, letting subclasses
 * override specific steps of the algorithm without changing its structure.
 *
 * When to Use:
 * - When you have multiple classes that implement similar algorithms with some variations
 * - When you want to let clients extend only particular steps of an algorithm
 * - When you want to avoid code duplication by moving common code to a single location
 * - When you need to control the points at which subclasses can extend behavior
 *
 * Real-world Use Cases:
 * - Data processing pipelines (read, process, write)
 * - Game AI behavior (evaluate, decide, execute)
 * - Document generation (header, content, footer)
 * - Testing frameworks (setup, execute, teardown)
 * - Web scraping workflows
 */

// Abstract class defining the template method
abstract class DataProcessor {
  // Template method - defines the algorithm skeleton
  public process(): void {
    console.log('\n🔄 Starting data processing...\n');

    this.readData();
    this.validateData();
    this.processData();
    this.saveData();

    if (this.shouldNotify()) {
      this.notify();
    }

    console.log('\n✅ Processing complete!\n');
  }

  // Abstract methods - must be implemented by subclasses
  protected abstract readData(): void;
  protected abstract processData(): void;
  protected abstract saveData(): void;

  // Concrete methods - common implementation
  protected validateData(): void {
    console.log('✓ Validating data...');
  }

  // Hook - optional override point with default implementation
  protected shouldNotify(): boolean {
    return true;
  }

  protected notify(): void {
    console.log('📧 Sending notification...');
  }
}

// Concrete implementation 1: CSV Processor
class CSVProcessor extends DataProcessor {
  protected readData(): void {
    console.log('📁 Reading data from CSV file...');
  }

  protected processData(): void {
    console.log('⚙️ Processing CSV data: parsing rows, cleaning values...');
  }

  protected saveData(): void {
    console.log('💾 Saving processed data to database...');
  }
}

// Concrete implementation 2: JSON Processor
class JSONProcessor extends DataProcessor {
  protected readData(): void {
    console.log('📁 Reading data from JSON file...');
  }

  protected processData(): void {
    console.log('⚙️ Processing JSON data: parsing objects, transforming structure...');
  }

  protected saveData(): void {
    console.log('💾 Saving processed data to cloud storage...');
  }

  // Override hook to disable notifications
  protected shouldNotify(): boolean {
    return false;
  }
}

// Concrete implementation 3: XML Processor
class XMLProcessor extends DataProcessor {
  protected readData(): void {
    console.log('📁 Reading data from XML file...');
  }

  protected processData(): void {
    console.log('⚙️ Processing XML data: parsing nodes, extracting attributes...');
  }

  protected saveData(): void {
    console.log('💾 Saving processed data to file system...');
  }

  protected notify(): void {
    console.log('📱 Sending SMS notification...');
  }
}

// Practical Example 2: Beverage Preparation
abstract class BeverageTemplate {
  // Template method
  public prepareBeverage(): void {
    console.log('\n☕ Preparing beverage...\n');

    this.boilWater();
    this.brew();
    this.pourInCup();

    if (this.customerWantsCondiments()) {
      this.addCondiments();
    }

    console.log('\n✅ Beverage ready!\n');
  }

  // Common methods
  private boilWater(): void {
    console.log('💧 Boiling water...');
  }

  private pourInCup(): void {
    console.log('☕ Pouring into cup...');
  }

  // Abstract methods
  protected abstract brew(): void;
  protected abstract addCondiments(): void;

  // Hook method
  protected customerWantsCondiments(): boolean {
    return true;
  }
}

class Tea extends BeverageTemplate {
  protected brew(): void {
    console.log('🍵 Steeping the tea...');
  }

  protected addCondiments(): void {
    console.log('🍋 Adding lemon...');
  }
}

class Coffee extends BeverageTemplate {
  protected brew(): void {
    console.log('☕ Dripping coffee through filter...');
  }

  protected addCondiments(): void {
    console.log('🥛 Adding sugar and milk...');
  }
}

class BlackCoffee extends BeverageTemplate {
  protected brew(): void {
    console.log('☕ Dripping coffee through filter...');
  }

  protected addCondiments(): void {
    console.log('(No condiments)');
  }

  protected customerWantsCondiments(): boolean {
    return false;
  }
}

// Practical Example 3: Report Generator
abstract class ReportGenerator {
  // Template method
  public generateReport(): void {
    console.log('\n📊 Generating report...\n');

    this.fetchData();
    this.formatHeader();
    this.formatBody();
    this.formatFooter();

    if (this.includeCharts()) {
      this.addCharts();
    }

    this.export();

    console.log('\n✅ Report generated!\n');
  }

  // Common methods
  protected fetchData(): void {
    console.log('📥 Fetching data from database...');
  }

  protected formatFooter(): void {
    console.log('📝 Adding footer with page numbers and date...');
  }

  // Abstract methods
  protected abstract formatHeader(): void;
  protected abstract formatBody(): void;
  protected abstract export(): void;

  // Hook methods
  protected includeCharts(): boolean {
    return false;
  }

  protected addCharts(): void {
    console.log('📈 Adding charts and graphs...');
  }
}

class PDFReport extends ReportGenerator {
  protected formatHeader(): void {
    console.log('📄 Formatting PDF header with logo and title...');
  }

  protected formatBody(): void {
    console.log('📄 Formatting body with tables and sections...');
  }

  protected export(): void {
    console.log('💾 Exporting as PDF file...');
  }

  protected includeCharts(): boolean {
    return true;
  }
}

class HTMLReport extends ReportGenerator {
  protected formatHeader(): void {
    console.log('🌐 Creating HTML header with navigation...');
  }

  protected formatBody(): void {
    console.log('🌐 Creating HTML body with responsive tables...');
  }

  protected export(): void {
    console.log('💾 Exporting as HTML file...');
  }

  protected includeCharts(): boolean {
    return true;
  }
}

class TextReport extends ReportGenerator {
  protected formatHeader(): void {
    console.log('📝 Creating plain text header...');
  }

  protected formatBody(): void {
    console.log('📝 Formatting body as plain text...');
  }

  protected export(): void {
    console.log('💾 Exporting as TXT file...');
  }
}

// Practical Example 4: Build Process
abstract class BuildProcess {
  // Template method
  public build(): void {
    console.log('\n🔨 Starting build process...\n');

    this.clean();
    this.compile();
    this.runTests();

    if (this.shouldOptimize()) {
      this.optimize();
    }

    this.package();
    this.deploy();

    console.log('\n✅ Build complete!\n');
  }

  // Common methods
  protected clean(): void {
    console.log('🗑️ Cleaning build directory...');
  }

  protected runTests(): void {
    console.log('🧪 Running tests...');
  }

  // Abstract methods
  protected abstract compile(): void;
  protected abstract package(): void;
  protected abstract deploy(): void;

  // Hook methods
  protected shouldOptimize(): boolean {
    return false;
  }

  protected optimize(): void {
    console.log('⚡ Optimizing build...');
  }
}

class ProductionBuild extends BuildProcess {
  protected compile(): void {
    console.log('⚙️ Compiling with optimizations enabled...');
  }

  protected package(): void {
    console.log('📦 Creating production bundle...');
  }

  protected deploy(): void {
    console.log('🚀 Deploying to production server...');
  }

  protected shouldOptimize(): boolean {
    return true;
  }
}

class DevelopmentBuild extends BuildProcess {
  protected compile(): void {
    console.log('⚙️ Compiling with source maps...');
  }

  protected package(): void {
    console.log('📦 Creating development bundle...');
  }

  protected deploy(): void {
    console.log('🔧 Starting development server...');
  }
}

// Demo function
export function demoTemplateMethod(): void {
  console.log('\n=== TEMPLATE METHOD PATTERN DEMO ===\n');

  // Example 1: Data Processors
  console.log('--- Data Processing Example ---');

  console.log('\nProcessing CSV:');
  const csvProcessor = new CSVProcessor();
  csvProcessor.process();

  console.log('\nProcessing JSON:');
  const jsonProcessor = new JSONProcessor();
  jsonProcessor.process();

  console.log('\nProcessing XML:');
  const xmlProcessor = new XMLProcessor();
  xmlProcessor.process();

  // Example 2: Beverage Preparation
  console.log('\n--- Beverage Preparation Example ---');

  const tea = new Tea();
  tea.prepareBeverage();

  const coffee = new Coffee();
  coffee.prepareBeverage();

  const blackCoffee = new BlackCoffee();
  blackCoffee.prepareBeverage();

  // Example 3: Report Generation
  console.log('\n--- Report Generation Example ---');

  const pdfReport = new PDFReport();
  pdfReport.generateReport();

  const htmlReport = new HTMLReport();
  htmlReport.generateReport();

  const textReport = new TextReport();
  textReport.generateReport();

  // Example 4: Build Process
  console.log('\n--- Build Process Example ---');

  const prodBuild = new ProductionBuild();
  prodBuild.build();

  const devBuild = new DevelopmentBuild();
  devBuild.build();

  console.log('✅ Template Method Pattern defines algorithm skeleton in base class\n');
}
