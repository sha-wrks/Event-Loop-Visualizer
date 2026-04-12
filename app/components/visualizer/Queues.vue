<script setup lang="ts">
defineProps<{ micro: string[], macro: string[] }>()
</script>

<template>
  <div class="col-span-2 border border-slate-800 bg-slate-900/30 p-5 rounded-sm">
    <h2 class="text-[10px] mb-4 text-yellow-500/70 font-bold border-b border-slate-800/50 pb-2 uppercase tracking-widest">03_Queue_Scheduling</h2>
    <div class="grid grid-cols-2 gap-6">
      <div class="space-y-2">
        <span class="text-[9px] text-purple-400/60 block uppercase font-black tracking-widest">Microtasks (High Priority)</span>
        <div class="min-h-[60px] border border-purple-500/20 rounded-sm p-2 flex gap-2 overflow-x-auto bg-purple-500/5">
          <div v-for="(q, i) in micro" :key="`micro-${i}`" class="bg-purple-500/20 border border-purple-400/50 text-purple-300 p-2 text-[10px] h-fit">
            {{ q }}
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <span class="text-[9px] text-yellow-400/60 block uppercase font-black tracking-widest">Macrotasks (Normal Priority)</span>
        <div class="min-h-[60px] border border-yellow-500/20 rounded-sm p-2 flex gap-2 overflow-x-auto bg-yellow-500/5">
          <div v-for="(q, i) in macro" :key="`macro-${i}`" class="bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 p-2 text-[10px] h-fit">
            {{ q }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>