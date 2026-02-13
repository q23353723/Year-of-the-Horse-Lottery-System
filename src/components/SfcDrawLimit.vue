<template>
  <div class="w-full max-w-4xl mx-auto mb-6">
    <!-- 主容器 - 改進的背景效果 -->
    <div class="bg-gradient-to-br from-horse-red/60 to-horse-red/40 border-2 border-horse-gold rounded-xl p-8 shadow-lg backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
      
      <!-- 內容容器 -->
      <div class="space-y-6">
        <!-- 標題區域 - 增加視覺亮點 -->
        <div class="flex items-center justify-center md:justify-start gap-3 pb-4 border-b-2 border-horse-gold/50">
          <div class="text-3xl">🎯</div>
          <div>
            <h2 class="text-horse-gold font-bold text-xl md:text-2xl">設定抽獎人數上限</h2>
            <p class="text-yellow-200/70 text-xs md:text-sm mt-1">控制本次抽獎的中獎人數數量</p>
          </div>
        </div>

        <!-- 主操作區 -->
        <div class="flex flex-col md:flex-row gap-6 items-center md:items-end">
          <!-- 輸入框容器 -->
          <div class="flex-1 space-y-2 w-full md:w-auto">
            <label class="block text-yellow-200 font-semibold text-sm">
              人數上限 (1 - {{ maxParticipants }})
            </label>
            <div class="relative">
              <input
                v-model.number="inputLimit"
                type="number"
                min="1"
                :max="maxParticipants"
                placeholder="輸入數字"
                class="w-full md:w-40 px-4 py-3 rounded-lg border-2 border-yellow-300 bg-yellow-50/10 text-yellow-100 placeholder-yellow-300/50 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 text-center font-bold text-lg transition-all duration-200 backdrop-blur"
                @keyup.enter="handleSetLimit"
              />
              <div class="absolute right-3 top-3 text-yellow-300 pointer-events-none">
                👥
              </div>
            </div>
          </div>

          <!-- 確定按鈕 - 改進的樣式 -->
          <button
            @click="handleSetLimit"
            :disabled="!isValidInput"
            class="w-full md:w-auto bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-500 text-red-900 font-bold py-3 px-8 rounded-lg shadow-[0_6px_0_rgb(180,83,9)] active:shadow-none active:translate-y-1 hover:cursor-pointer hover:brightness-110 hover:shadow-[0_8px_0_rgb(180,83,9)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-[0_2px_0_rgb(180,83,9)] transition-all duration-150 border-2 border-yellow-200 text-base md:text-lg"
          >
            ✓ 確定設定
          </button>

          <!-- 已設定顯示 - 改進的呈現 -->
          <div class="w-full md:w-auto">
            <transition name="fade-scale" mode="out-in">
              <div v-if="drawLimit !== null" class="bg-yellow-300/20 border-2 border-yellow-300 rounded-lg px-6 py-3 text-center backdrop-blur">
                <div class="text-yellow-100 text-xs font-semibold uppercase tracking-wide">上限設定</div>
                <div class="text-yellow-300 font-bold text-2xl mt-1">{{ drawLimit }} 人</div>
              </div>
              <div v-else class="bg-yellow-900/20 border-2 border-yellow-200/50 rounded-lg px-6 py-3 text-center backdrop-blur">
                <div class="text-yellow-200 text-xs font-semibold uppercase tracking-wide">狀態</div>
                <div class="text-yellow-200/60 font-semibold text-sm mt-1">未設定</div>
              </div>
            </transition>
          </div>
        </div>

        <!-- 信息條 - 參與者計數 -->
        <div class="bg-yellow-300/10 border-l-4 border-yellow-300 rounded-r-lg px-4 py-3 flex items-center gap-3 backdrop-blur">
          <div class="text-2xl">ℹ️</div>
          <div class="flex-1">
            <p class="text-yellow-100 text-sm">
              目前參與者：<span class="font-bold text-yellow-300">{{ maxParticipants }}</span> 人
            </p>
          </div>
        </div>

        <!-- 錯誤訊息顯示 - 改進的樣式 -->
        <transition name="shake">
          <div v-if="errorMessage" class="bg-red-500/30 border-2 border-red-400 rounded-lg p-4 text-center backdrop-blur">
            <div class="flex items-center justify-center gap-2">
              <span class="text-2xl animate-pulse">⚠️</span>
              <span class="text-red-100 font-semibold">{{ errorMessage }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLottery } from '../composables/useLottery';

// 從 useLottery 取得相關值
const { drawLimit, participants, winners, setDrawLimit, setDrawLimitForce } = useLottery();

// 本地狀態
const inputLimit = ref('');
const errorMessage = ref('');

// 計算屬性
const maxParticipants = computed(() => participants.value.length);

const isValidInput = computed(() => {
  const num = parseInt(inputLimit.value);
  return Number.isInteger(num) && num > 0 && num <= maxParticipants.value;
});

// 設定抽獎人數上限
const handleSetLimit = () => {
  // 清除之前的錯誤訊息
  errorMessage.value = '';

  // 驗證輸入
  if (!isValidInput.value) {
    errorMessage.value = `請輸入 1 到 ${maxParticipants.value} 之間的正整數`;
    return;
  }

  const limit = parseInt(inputLimit.value);

  try {
    // 嘗試直接設定
    setDrawLimit(limit);
    inputLimit.value = ''; // 清除輸入框
  } catch (error) {
    // 如果已有中獎記錄，彈出確認對話框
    if (error.message === '重新設定') {
      if (confirm(`已有 ${winners.value.length} 筆中獎記錄，重新設定將清除所有已中獎名單，確定要繼續嗎？`)) {
        try {
          setDrawLimitForce(limit);
          inputLimit.value = ''; // 清除輸入框
          errorMessage.value = ''; // 清除錯誤訊息
        } catch (forceError) {
          errorMessage.value = forceError.message;
        }
      }
    } else {
      // 其他錯誤直接顯示
      errorMessage.value = error.message;
    }
  }
};
</script>

<style scoped>
/* 移除輸入框的數字微調按鈕 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* 過渡動畫 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 搖晃動畫（錯誤提示） */
.shake-enter-active,
.shake-leave-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.shake-enter-from {
  opacity: 0;
  transform: translateX(-20px) rotateZ(-2deg);
}

.shake-leave-to {
  opacity: 0;
  transform: translateX(-20px) rotateZ(-2deg);
}

/* 輸入框焦點效果 */
input:focus {
  animation: inputGlow 0.3s ease-out;
}

@keyframes inputGlow {
  from {
    box-shadow: 0 0 0 3px rgba(253, 224, 71, 0.1);
  }
  to {
    box-shadow: 0 0 0 0px rgba(253, 224, 71, 0);
  }
}

/* 脈衝動畫 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}</style>
