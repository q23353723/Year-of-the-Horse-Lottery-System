<template>
  <div class="flex flex-col items-center justify-center p-6 border-2 border-horse-gold border-dashed rounded-lg bg-horse-dark/50 backdrop-blur-sm">
    <label for="file-upload" class="cursor-pointer flex flex-col items-center gap-2 text-horse-gold hover:text-white transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <span class="text-lg font-bold">上傳 Excel 名單</span>
      <span class="text-sm opacity-70">支援 .xlsx, .xls</span>
    </label>
    <input id="file-upload" type="file" class="hidden" accept=".xlsx, .xls" @change="handleFileUpload" />
    <p v-if="fileName" class="mt-2 text-white">{{ fileName }} (已匯入 {{ count }} 人)</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { useLottery } from '../composables/useLottery';

const { addParticipants } = useLottery();
const fileName = ref('');
const count = ref(0);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  fileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    if (jsonData.length > 0) {
        addParticipants(jsonData);
        count.value = jsonData.length;
    } else {
        alert('檔案內容為空！');
    }
  };
  reader.readAsArrayBuffer(file);
};
</script>
