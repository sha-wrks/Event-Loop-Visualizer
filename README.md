# JS Runtime Visualizer with Nuxt 4

A high-fidelity architectural simulation of the JavaScript Event Loop and V8 runtime behavior. Engineered with Nuxt 4, this system utilizes AST (Abstract Syntax Tree) Parsing to deconstruct and visualize the execution of synchronous and asynchronous JavaScript operations in real-time.

## Technical Specifications
* **Runtime**: Nuxt 4 (Future Compatibility Mode)
* **Engine**: Acorn.js (High-performance JavaScript Parser)
* **State Management**: Pinia (Virtual Machine State Tracking)
* **Styling**: Tailwind CSS (Monospace System Design)
* **Rendering**: Client-Side Only (SSR Disabled for direct Browser API interaction)

## Core Architectural Features
1. **AST-Driven Interpreter**: Unlike a simple eval(), this system parses code into an Abstract Syntax Tree to control execution flow line-by-line.
2. **Concurrency Simulation**: Implements a custom scheduler to demonstrate the priority difference between Microtasks (Promises) and Macrotasks (setTimeout).
3. **Virtual Machine State**: Real-time tracking of the Call Stack (LIFO), Web APIs, and Task Queues (FIFO).

## Environment Setup
Ensure you have Node.js 20+ installed. Clone the repository and install dependencies:
```bash
npm install
```

## Deployment
Run the development server on http://localhost:3000:
```bash
npm run dev
```

## Execution Pipeline Documentation
### 1. Code Deconstruction

The engine utilizes `acorn` to generate a node-based map of the source code. This ensures memory safety and allows the UI to "await" each execution step for visual clarity.

### 2. Event Loop Monitoring

A dedicated background process (Event Loop) continuously polls the Call Stack. Once the stack is empty, it orchestrates the migration of tasks from the Microtask Queue, followed by the Macrotask Queue.

### 3. State Persistence

Utilizes Pinia stores to maintain an atomic record of the Virtual Machine state, ensuring reactive UI updates without triggering unnecessary re-renders in the Nuxt 4 reactive system.