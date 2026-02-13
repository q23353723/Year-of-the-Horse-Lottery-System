<template>
  <div v-if="winners.length > 0" class="w-full max-w-4xl mx-auto p-6 bg-red-900/90 rounded-xl shadow-2xl mt-8 border-2 border-yellow-500/50 backdrop-blur-sm">
    <div class="flex justify-between items-center mb-6 border-b border-yellow-500/30 pb-4">
      <h2 class="text-2xl font-bold text-yellow-400 flex items-center gap-2">
        <span>🏆</span> 中獎名單 ({{ winners.length }}人)
      </h2>
      <button 
        @click="exportExcel"
        class="bg-green-600 hover:bg-green-500 hover:cursor-pointer text-white px-5 py-2 rounded-lg transition-colors shadow-lg flex items-center gap-2 font-bold border border-green-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        匯出 Excel
      </button>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
      <div 
        v-for="(person, index) in winners" 
        :key="person.id || index"
        class="bg-yellow-50 p-3 rounded-lg text-center text-red-900 border border-yellow-200 shadow-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
      >
        <span class="font-bold text-red-600 bg-yellow-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">
          {{ index + 1 }}
        </span>
        <span class="font-bold truncate">{{ person.EmpNo || person['工號'] || person['emp_no'] }} {{ person.name || person['姓名'] || person['Name'] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLottery } from '../composables/useLottery';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { winners } = useLottery();

const exportExcel = () => {
  if (winners.value.length === 0) return;

  const ws = XLSX.utils.json_to_sheet(winners.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Winners");
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'draw_results.xlsx');
};
</script>
