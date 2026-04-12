<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>

<template>
  <div class="border border-slate-800 bg-slate-900/30 p-5 rounded-sm flex flex-col h-full">
    <h2 class="text-[10px] mb-4 text-emerald-500/70 font-bold border-b border-slate-800/50 pb-2 flex justify-between uppercase">
      <span>01_CALL_STACK</span>
      <span class="opacity-50">LIFO</span>
    </h2>
    <div class="flex-1 flex flex-col-reverse justify-start gap-3">
      <TransitionGroup 
        enter-active-class="transform transition duration-300 ease-out"
        enter-from-class="translate-y-4 opacity-0 scale-95"
        leave-active-class="transform transition duration-200 ease-in"
        leave-to-class="-translate-y-4 opacity-0 scale-95"
      >
        <div v-for="(item, i) in items" :key="`stack-${i}`" 
             class="bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-400 p-3 font-bold text-sm shadow-lg">
          {{ item }}
        </div>
      </TransitionGroup>
      <div v-if="items.length === 0" class="flex-1 flex items-center justify-center text-slate-800 text-xs italic border-2 border-dashed border-slate-900">
        STACK_EMPTY
      </div>
    </div>
  </div>
</template>