<template>
  <div class="min-h-screen bg-horse-dark bg-[url('/bg-pattern.svg')] bg-cover text-white font-sans flex flex-col">
    <!-- Header -->
    <header class="p-6 text-center border-b-4 border-horse-gold shadow-lg bg-horse-red relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full opacity-0 bg-[url('https://www.transparenttextures.com/patterns/chinese-new-year.png')]"></div>
      <h1 class="text-4xl md:text-6xl font-bold text-horse-gold drop-shadow-md z-10 relative">
        🐎 金馬奔騰 • 新春大抽獎 🧧
      </h1>
      <p class="text-white/80 mt-2 text-lg">Harness the Luck of the Horse!</p>
    </header>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto p-4 flex flex-col items-center justify-center gap-8">
      
      <!-- Upload Stage -->
      <transition name="fade" mode="out-in">
        <div v-if="participants.length === 0" class="w-full max-w-md animate-fade-in-up">
          <SfcUpload />
        </div>

        <!-- Lottery Stage -->
        <div v-else class="w-full flex flex-col items-center animate-fade-in-up">
           <SfcDrawLimit />
           <SfcLottery />
           <SfcResult />
           
           <button 
             @click="resetAll" 
             class="mt-12 text-sm text-white/50 hover:text-white underline decoration-horse-gold decoration-2"
           >
             重置所有資料 (Reset)
           </button>
        </div>
      </transition>
      
    </main>

    <!-- Footer -->
    <footer class="p-4 text-center text-horse-gold/50 text-sm">
      &copy; 2026 Year of the Horse Lottery System
    </footer>
  </div>
</template>

<script setup>
import { useLottery } from './composables/useLottery';
import SfcUpload from './components/SfcUpload.vue';
import SfcDrawLimit from './components/SfcDrawLimit.vue';
import SfcLottery from './components/SfcLottery.vue';
import SfcResult from './components/SfcResult.vue';

const { participants, clearParticipants } = useLottery();

const resetAll = () => {
    if (confirm('確定要重置所有抽選名單與結果嗎？')) {
        clearParticipants();
    }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}
</style>
