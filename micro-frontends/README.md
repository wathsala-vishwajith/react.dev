# Micro-Frontend Architecture with Module Federation

This project demonstrates a complete micro-frontend architecture using Webpack 5's Module Federation. It shows how to build, compose, and independently deploy multiple React applications that work together seamlessly.

## 🏗️ Architecture Overview

This application is composed of **four independent micro-frontends**:

```
┌─────────────────────────────────────────────────────────┐
│                    Host Application                      │
│                     (Port 3000)                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Orchestrates all remotes               │  │
│  │                                                   │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │  Header  │  │ Products │  │ Checkout │      │  │
│  │  │ (Remote) │  │ (Remote) │  │ (Remote) │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Applications

1. **Host App** (Port 3000)
   - Container application that orchestrates all micro-frontends
   - Manages global state (cart management)
   - Loads and composes remote components

2. **Header Remote** (Port 3001)
   - Provides the application header with navigation
   - Displays cart count
   - Independently deployable

3. **Products Remote** (Port 3002)
   - Product catalog with filtering
   - Add-to-cart functionality
   - Independently deployable

4. **Checkout Remote** (Port 3003)
   - Shopping cart management
   - Order processing
   - Independently deployable

## 🚀 Key Features

- **Independent Deployment**: Each micro-frontend can be built, tested, and deployed independently
- **Shared Dependencies**: React and ReactDOM are shared as singletons to avoid duplication
- **Runtime Integration**: Components are loaded at runtime, not build time
- **Type Safety**: Each app can be developed with its own TypeScript config
- **Independent Development**: Each team can work autonomously on their micro-frontend

## 📦 Module Federation Configuration

### Host Configuration

The host app consumes remote modules:

```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    header: 'header@http://localhost:3001/remoteEntry.js',
    products: 'products@http://localhost:3002/remoteEntry.js',
    checkout: 'checkout@http://localhost:3003/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  },
})
```

### Remote Configuration

Each remote exposes its components:

```javascript
new ModuleFederationPlugin({
  name: 'header',
  filename: 'remoteEntry.js',
  exposes: {
    './Header': './src/Header',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  },
})
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Basic understanding of React and Webpack

### Installation

Install dependencies for all applications:

```bash
# Install host app dependencies
cd host
npm install

# Install header app dependencies
cd ../header
npm install

# Install products app dependencies
cd ../products
npm install

# Install checkout app dependencies
cd ../checkout
npm install
```

### Running in Development Mode

You need to run all applications simultaneously. Open **4 terminal windows**:

**Terminal 1 - Header Remote:**
```bash
cd header
npm start
# Running on http://localhost:3001
```

**Terminal 2 - Products Remote:**
```bash
cd products
npm start
# Running on http://localhost:3002
```

**Terminal 3 - Checkout Remote:**
```bash
cd checkout
npm start
# Running on http://localhost:3003
```

**Terminal 4 - Host App:**
```bash
cd host
npm start
# Running on http://localhost:3000
```

**Important**: Start the remote applications (header, products, checkout) **before** starting the host application.

### Accessing the Application

Open your browser and navigate to:
- **Host Application**: http://localhost:3000
- **Header (Standalone)**: http://localhost:3001
- **Products (Standalone)**: http://localhost:3002
- **Checkout (Standalone)**: http://localhost:3003

## 🏭 Production Build

### Building Individual Micro-Frontends

```bash
# Build header
cd header
npm run build

# Build products
cd ../products
npm run build

# Build checkout
cd ../checkout
npm run build

# Build host
cd ../host
npm run build
```

### Serving Production Builds Locally

After building, you can serve each app:

```bash
# Serve header (port 3001)
cd header
npm run serve

# Serve products (port 3002)
cd products
npm run serve

# Serve checkout (port 3003)
cd checkout
npm run serve

# Serve host (port 3000)
cd host
npm run serve
```

## 🚢 Deployment Strategies

### Strategy 1: Independent Deployment to Different Servers

Each micro-frontend can be deployed to a separate server or CDN:

```javascript
// Host webpack config for production
remotes: {
  header: 'header@https://header.example.com/remoteEntry.js',
  products: 'products@https://products.example.com/remoteEntry.js',
  checkout: 'checkout@https://checkout.example.com/remoteEntry.js',
}
```

**Benefits:**
- True independence - deploy each app separately
- Different teams can manage their own infrastructure
- Scale individual micro-frontends based on load

### Strategy 2: Mono-Repo with Shared Deployment

Deploy all apps together but maintain separate build processes:

```
micro-frontends/
├── host/          → Deploy to /
├── header/        → Deploy to /header/
├── products/      → Deploy to /products/
├── checkout/      → Deploy to /checkout/
```

**Benefits:**
- Simplified deployment pipeline
- Easier version management
- Shared infrastructure

### Strategy 3: CDN Deployment

Deploy each micro-frontend's build to a CDN:

```javascript
// Use environment variables for remote URLs
remotes: {
  header: `header@${process.env.HEADER_URL}/remoteEntry.js`,
  products: `products@${process.env.PRODUCTS_URL}/remoteEntry.js`,
  checkout: `checkout@${process.env.CHECKOUT_URL}/remoteEntry.js`,
}
```

**Benefits:**
- Low latency worldwide
- High availability
- Automatic caching

## 🔄 Continuous Integration & Deployment

### Example CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy Header Micro-Frontend

on:
  push:
    branches: [main]
    paths:
      - 'header/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: cd header && npm install
      - name: Build
        run: cd header && npm run build
      - name: Deploy to CDN
        run: # Your deployment command
```

## 🧪 Testing Strategy

### Unit Testing
Test each component in isolation:

```bash
cd header
npm test
```

### Integration Testing
Test the host app with mocked remotes:

```javascript
// Mock remote modules in tests
jest.mock('header/Header', () => ({
  default: () => <div>Mocked Header</div>
}));
```

### End-to-End Testing
Test the full application with all remotes running:

```bash
# Start all apps
npm run start:all

# Run E2E tests
npm run test:e2e
```

## 📊 Monitoring & Observability

When running micro-frontends in production, monitor:

1. **Load Times**: Track how long remote modules take to load
2. **Error Rates**: Monitor failed module loads
3. **Version Compatibility**: Ensure shared dependencies match
4. **Network Requests**: Watch for duplicate dependency loads

## 🎯 Best Practices

### 1. Version Management
- Use semantic versioning for all micro-frontends
- Document breaking changes
- Maintain backward compatibility when possible

### 2. Shared Dependencies
```javascript
shared: {
  react: {
    singleton: true,              // Only one instance
    requiredVersion: '^18.2.0',   // Version constraint
    strictVersion: false,          // Allow version flexibility
  },
}
```

### 3. Error Handling
```javascript
// Wrap remote components in error boundaries
<Suspense fallback={<Loading />}>
  <ErrorBoundary fallback={<ErrorFallback />}>
    <RemoteComponent />
  </ErrorBoundary>
</Suspense>
```

### 4. Performance Optimization
- Use code splitting within each micro-frontend
- Implement lazy loading for remote modules
- Monitor bundle sizes
- Use React.Suspense for loading states

### 5. Communication Between Micro-Frontends
- Use props for direct communication
- Implement event bus for indirect communication
- Consider shared state management (Redux, Zustand)

## 🔧 Troubleshooting

### Remote Module Not Loading

**Issue**: `Error loading remote module`

**Solutions:**
1. Ensure remote app is running on the correct port
2. Check CORS headers are set correctly
3. Verify `remoteEntry.js` is accessible
4. Check browser console for network errors

### Version Mismatch Errors

**Issue**: `Shared module version mismatch`

**Solutions:**
1. Ensure all apps use compatible React versions
2. Check `requiredVersion` in Module Federation config
3. Clear node_modules and reinstall dependencies

### Development Server Issues

**Issue**: Changes not reflecting

**Solutions:**
1. Enable hot reload in webpack config
2. Restart the affected micro-frontend
3. Clear browser cache

## 📚 Additional Resources

- [Webpack Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Micro-Frontends.org](https://micro-frontends.org/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)

## 🤝 Contributing

When contributing to this project:

1. Make changes to the specific micro-frontend
2. Test locally with the host app
3. Update this README if architecture changes
4. Document any new environment variables

## 📄 License

This project is for educational purposes demonstrating micro-frontend architecture.

## 🎓 Learning Outcomes

After exploring this project, you should understand:

- ✅ How to configure Webpack Module Federation
- ✅ How to create independent deployable React applications
- ✅ How to share dependencies between micro-frontends
- ✅ How to compose a larger application from smaller parts
- ✅ Different deployment strategies for micro-frontends
- ✅ Communication patterns between micro-frontends
- ✅ Error handling and fallback strategies
- ✅ Performance considerations in micro-frontend architecture

---

**Built with ❤️ to demonstrate Micro-Frontend Architecture**
