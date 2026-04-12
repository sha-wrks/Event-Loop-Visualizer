import * as acorn from "acorn";
import { useVMStore } from "../stores/useVM";

export const useInterpreter = () => {
  const vm = useVMStore();

  /**
   * Main Entry Point
   */
  const parseAndRun = async (code: string) => {
    vm.reset();
    vm.isRunning = true;
    vm.logs.push("SYSTEM_START: Initializing V8 Sandbox...");

    // Jalankan Event Loop Monitor secara paralel
    startEventLoop();

    try {
      const ast = acorn.parse(code, {
        ecmaVersion: 2020,
        sourceType: "script",
      }) as any;

      await processNodes(ast.body);
    } catch (err: any) {
      vm.logs.push(`PARSER_ERROR: ${err.message}`);
    } finally {
      vm.isRunning = false;
      vm.logs.push("MAIN_THREAD_EMPTY: Script execution finished.");
    }
  };

  /**
   * Program Counter / Node Processor
   */
  const processNodes = async (nodes: any[]) => {
    for (const node of nodes) {
      // Delay agar animasi per baris terlihat
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 1. Handle console.log, setTimeout, Promise
      if (node.type === "ExpressionStatement") {
        const expr = node.expression;

        if (expr.type === "CallExpression") {
          // A. Handle console.log
          if (expr.callee.object?.name === "console") {
            const funcName = `console.${expr.callee.property.name}()`;
            executeSync(funcName);
          }

          // B. Handle setTimeout (Macrotask)
          else if (expr.callee.name === "setTimeout") {
            vm.pushStack("setTimeout()");
            const delay = expr.arguments[1]?.value || 0;

            vm.logs.push(`WebAPI: Registering timer for ${delay}ms`);
            vm.addToWebAPI("timer_cb", delay); // Ini otomatis nge-push ke callbackQueue saat selesai

            await sleep(500);
            vm.popStack();
          }

          // C. Handle Promise.resolve().then() (Microtask)
          else if (expr.callee.property?.name === "then") {
            vm.pushStack("Promise.then()");
            vm.logs.push("Microtask: Adding callback to Microtask Queue");
            vm.microtaskQueue.push("promise_cb");

            await sleep(500);
            vm.popStack();
          }
        }
      }

      // 2. Handle Deklarasi Fungsi
      if (node.type === "FunctionDeclaration") {
        vm.logs.push(`MEM_ALLOC: Function ${node.id.name} stored in heap`);
      }
    }
  };

  /**
   * THE EVENT LOOP (The Heart of JS)
   */
  const startEventLoop = async () => {
    // Loop terus selama ada proses atau script masih jalan
    while (
      vm.isRunning ||
      vm.callbackQueue.length > 0 ||
      vm.microtaskQueue.length > 0 ||
      vm.webAPIs.length > 0
    ) {
      await sleep(100); // Tick rate

      // Aturan Event Loop:
      // Hanya ambil task jika Call Stack benar-benar KOSONG
      if (vm.callStack.length === 0) {
        // PRIORITAS 1: Microtask Queue (Promises)
        if (vm.microtaskQueue.length > 0) {
          const task = vm.microtaskQueue.shift();
          if (task) {
            vm.logs.push(
              `EVENT_LOOP: Priority Microtask found. Moving ${task} to Stack.`,
            );
            executeTask(task);
            await sleep(1000);
          }
        }

        // PRIORITAS 2: Callback Queue (Macrotasks / setTimeout)
        else if (vm.callbackQueue.length > 0) {
          const task = vm.callbackQueue.shift();
          if (task) {
            vm.logs.push(
              `EVENT_LOOP: Macrotask found. Moving ${task} to Stack.`,
            );
            executeTask(task);
            await sleep(1000);
          }
        }
      }
    }
    vm.logs.push("EVENT_LOOP_IDLE: No more tasks in queues.");
  };

  /**
   * Helper: Eksekusi fungsi sinkron
   */
  const executeSync = async (name: string) => {
    vm.pushStack(name);
    await sleep(600);
    vm.popStack();
  };

  /**
   * Helper: Eksekusi task dari Queue
   */
  const executeTask = async (name: string) => {
    vm.pushStack(name);
    await sleep(800);
    vm.popStack();
  };

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  return { parseAndRun };
};
