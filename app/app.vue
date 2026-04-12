<script setup lang="ts">
import { useVMStore } from './stores/useVM'
import { useInterpreter } from './logic/engine'

const vm = useVMStore()
const { parseAndRun } = useInterpreter()

const codeInput = ref(`console.log('1. Start');
setTimeout(() => console.log('4. Timeout'), 0);
Promise.resolve().then(() => console.log('3. Promise'));
console.log('2. End');`)

const runSimulation = () => {
  if (vm.isRunning) return
  parseAndRun(codeInput.value)
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-200 p-6 font-mono selection:bg-emerald-500/30">
    <header class="flex justify-between items-center mb-8 border-b border-slate-800 pb-4 backdrop-blur-sm sticky top-0 z-10 bg-slate-950/80">
      <div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h1 class="text-xl font-bold text-emerald-400 tracking-tighter">JS_RUNTIME_VISUALIZER v4.0</h1>
        </div>
        <p class="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Nuxt 4 / Principal Architect Edition</p>
      </div>
      <div class="flex gap-3">
        <button @click="vm.reset()" class="px-5 py-2 border border-slate-700 text-slate-400 hover:bg-slate-900 transition text-xs font-bold">_RESET</button>
        <button @click="runSimulation" :disabled="vm.isRunning" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          {{ vm.isRunning ? 'EXECUTING...' : 'RUN_CODE' }}
        </button>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-4 flex flex-col gap-2">
        <label class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Input_Buffer</label>
        <textarea v-model="codeInput" spellcheck="false" class="w-full h-[550px] bg-slate-900/50 border border-slate-800 p-5 text-sm outline-none focus:border-emerald-500/50 transition-all resize-none text-emerald-100/80 rounded-sm"></textarea>
      </div>

      <div class="col-span-8 grid grid-cols-2 gap-6">
        
        <VisualizerStack :items="vm.callStack" />

        <div class="border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
          <h2 class="text-[10px] mb-4 text-blue-500/70 font-bold border-b border-slate-800/50 pb-2 uppercase tracking-widest">02_Browser_WebAPIs</h2>
          <div class="flex flex-col gap-3">
            <div v-for="api in vm.webAPIs" :key="api.id" class="bg-blue-500/5 border border-blue-500/30 text-blue-400 p-3 text-sm flex justify-between items-center">
              <span class="font-bold underline decoration-blue-500/20">{{ api.label }}</span>
              <span class="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded animate-pulse">{{ api.timer }}ms</span>
            </div>
          </div>
        </div>

        <VisualizerQueues :micro="vm.microtaskQueue" :macro="vm.callbackQueue" />

        <div class="col-span-2 bg-black/50 border border-slate-800 rounded-sm p-4 h-40 overflow-y-auto">
          <div v-for="(log, i) in vm.logs" :key="i" class="text-[11px] font-mono mb-1 text-slate-400 border-b border-slate-900 last:border-0">
            <span class="text-emerald-900 font-bold mr-2">[{{ i.toString().padStart(2, '0') }}]</span> {{ log }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
</style>