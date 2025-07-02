# Local Development Guide

## Method 1: Using npm link (Recommended)

1. **Build your package in development mode with watch:**
   ```bash
   npm run build:watch
   ```
   This will rebuild your package automatically when you make changes.

2. **In another terminal, link your package globally:**
   ```bash
   npm link
   ```

3. **Create a new React app or use an existing one:**
   ```bash
   npx create-react-app my-test-app
   cd my-test-app
   ```

4. **Link your package to the test app:**
   ```bash
   npm link adstia-quiz-builder
   ```

5. **Use your component in the test app:**
   ```jsx
   import HelloWorld from 'adstia-quiz-builder';
   
   function App() {
     return (
       <div>
         <HelloWorld />
       </div>
     );
   }
   ```

## Method 2: Using the provided test app

1. **Install dependencies for the test app:**
   ```bash
   cd example/test-app
   npm install
   ```

2. **Link your package:**
   ```bash
   npm link adstia-quiz-builder
   ```

3. **Start the test app:**
   ```bash
   npm start
   ```

## Method 3: Using file path (for quick testing)

You can install your package directly from the file system:

```bash
cd your-test-project
npm install ../path/to/adstia-quiz-builder
```

## Development Workflow

1. Make changes to your component in `src/index.js`
2. Run `npm run build:watch` to automatically rebuild
3. Test changes in your linked test application
4. The changes will be reflected automatically (you might need to refresh the browser)

## Unlinking

When you're done testing:

```bash
# In your test project
npm unlink adstia-quiz-builder

# In your package directory
npm unlink
```
