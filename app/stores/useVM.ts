import { defineStore } from "pinia";

export const useVMStore = defineStore("vm", {
  state: () => ({
    // Fungsi yang sedang berjalan (LIFO - Last In First Out)
    callStack: [] as string[],

    // Proses yang sedang menunggu (Timer, Fetch, dll)
    webAPIs: [] as { id: number; label: string; timer?: number }[],

    // Antrean Microtask (Promise) - Prioritas Tinggi
    microtaskQueue: [] as string[],

    // Antrean Callback/Macrotask (setTimeout) - Prioritas Normal
    callbackQueue: [] as string[],

    // Log output seperti console.log
    logs: [] as string[],

    // Status eksekusi
    isRunning: false,
  }),

  actions: {
    pushStack(name: string) {
      this.callStack.push(name);
      this.logs.push(`Pushing ${name} to Stack`);
    },

    popStack() {
      const name = this.callStack.pop();
      if (name) this.logs.push(`Popping ${name} from Stack`);
    },

    addToWebAPI(label: string, ms: number) {
      const id = Date.now();
      this.webAPIs.push({ id, label, timer: ms });

      // Simulasi proses Web API selesai
      setTimeout(() => {
        this.webAPIs = this.webAPIs.filter((item) => item.id !== id);
        this.callbackQueue.push(label);
        this.logs.push(`${label} moved to Callback Queue`);
      }, ms);
    },

    reset() {
      this.$reset();
    },
  },
});
