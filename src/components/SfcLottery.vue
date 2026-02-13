<template>
  <div class="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-4">
    <!-- Display Area -->
    <div class="relative w-full aspect-video bg-horse-red border-4 border-horse-gold rounded-xl shadow-2xl flex items-center justify-center overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')]"></div>
      
      <div v-if="currentDraw.length > 0" class="flex flex-wrap justify-center gap-4 p-4 z-10 w-full h-full overflow-auto content-center">
        <div 
          v-for="winner in currentDraw" 
          :key="winner.id"
          class="bg-yellow-50 text-red-900 font-bold text-2xl md:text-3xl p-4 rounded-lg shadow-[0_4px_0_rgb(180,83,9)] animate-bounce-in border-2 border-yellow-500 w-48 h-32 flex items-center justify-center text-center leading-tight hover:scale-105 transition-transform"
        >
          {{ winner.EmpNo || winner['工號'] || winner['emp_no'] }} {{ winner.name || winner['姓名'] || winner['Name'] || 'Winner' }}
        </div>
      </div>
      <div v-else class="text-horse-gold text-4xl md:text-6xl font-bold opacity-50 z-10 animate-pulse drop-shadow-lg">
        {{ isDrawing ? 'Drawing...' : '等待開獎' }}
      </div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-horse-gold rounded-tl-xl"></div>
      <div class="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-horse-gold rounded-tr-xl"></div>
      <div class="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-horse-gold rounded-bl-xl"></div>
      <div class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-horse-gold rounded-br-xl"></div>
    </div>

    <!-- Controls -->
    <div class="flex gap-6">
      <button 
        @click="handleDraw(1)" 
        :disabled="isDrawing || remainingCount < 1"
        class="bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-900 font-bold py-4 px-10 rounded-full shadow-[0_6px_0_rgb(180,83,9)] active:shadow-none active:translate-y-1 hover:cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xl md:text-2xl border-2 border-yellow-200"
      >
        🧧 單抽及第
      </button>
      <button 
        @click="handleDraw(10)" 
        :disabled="isDrawing || remainingCount < 10"
        class="bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-900 font-bold py-4 px-10 rounded-full shadow-[0_6px_0_rgb(180,83,9)] active:shadow-none active:translate-y-1 hover:cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xl md:text-2xl border-2 border-yellow-200"
      >
        🐎 十全十美
      </button>
    </div>

    <div class="text-yellow-300 text-xl font-bold drop-shadow-md bg-red-900/50 px-6 py-2 rounded-full border border-yellow-500/30">
        剩餘人數: {{ remainingCount }}
    </div>
  </div>
</template>

<script setup>
import { useLottery } from '../composables/useLottery';
import confetti from 'canvas-confetti';
import { watch } from 'vue';

const { draw, currentDraw, isDrawing, remainingCount } = useLottery();

const handleDraw = (count) => {
    draw(count);
};

watch(currentDraw, (newVal) => {
    if (newVal.length > 0) {
        fireConfetti();
    }
});

const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#E60012', '#FFFFFF']
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FFD700', '#E60012', '#FFFFFF']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
};
</script>

<style scoped>
@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
</style>
