import { ref, computed } from 'vue';

const participants = ref([]);
const winners = ref([]);
const currentDraw = ref([]);
const isDrawing = ref(false);
const drawLimit = ref(null); // 設定的抽獎人數上限，null 表示未設定

export function useLottery() {

    const addParticipants = (data) => {
        // Expect data to be array of objects
        // Filter out already existing participants if needed, or just replace
        // For now, let's append but avoid duplicates based on a unique field if present, else just append
        // improving: add ID if missing
        const newParticipants = data.map((p, index) => ({
            ...p,
            id: p.id || `p-${Date.now()}-${index}-${Math.random()}`,
            originalIndex: index
        }));
        participants.value = [...participants.value, ...newParticipants];
    };

    const clearParticipants = () => {
        participants.value = [];
        winners.value = [];
        currentDraw.value = [];
        drawLimit.value = null; // 重置抽獎人數上限
    };

    // 設定抽獎人數上限
    const setDrawLimit = (limit) => {
        // 驗證輸入
        if (!Number.isInteger(limit) || limit <= 0) {
            throw new Error('抽獎人數必須是正整數');
        }

        if (limit > participants.value.length) {
            throw new Error(`抽獎人數不能超過參與人數 ${participants.value.length} 人`);
        }

        // 如果已經有人中獎，警告並詢問是否清除結果
        if (winners.value.length > 0) {
            throw new Error('重新設定'); // 特殊標記，讓元件決定是否確認
        }

        drawLimit.value = limit;
    };

    // 強制設定抽獎人數上限（用於用戶確認後的重新設定）
    const setDrawLimitForce = (limit) => {
        // 驗證輸入
        if (!Number.isInteger(limit) || limit <= 0) {
            throw new Error('抽獎人數必須是正整數');
        }

        if (limit > participants.value.length) {
            throw new Error(`抽獎人數不能超過參與人數 ${participants.value.length} 人`);
        }

        // 清除已有的中獎記錄
        winners.value = [];
        currentDraw.value = [];

        drawLimit.value = limit;
    };

    const draw = (count = 1) => {
        if (participants.value.length === 0) return;

        // Filter out winners
        const available = participants.value.filter(p => !winners.value.some(w => w.id === p.id));

        if (available.length === 0) {
            alert('所有名單皆已中獎！');
            return;
        }

        if (available.length < count) {
            alert(`剩餘人數不足 ${count} 人，只抽出 ${available.length} 人`);
            count = available.length;
        }

        isDrawing.value = true;
        currentDraw.value = []; // Reset current draw display

        // Random selection
        const selected = [];
        const tempAvailable = [...available];

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * tempAvailable.length);
            const winner = tempAvailable.splice(randomIndex, 1)[0];
            selected.push(winner);
        }

        // Delay to simulate drawing animation time (handled by component, but logic updates state)
        // We update state immediately for logic, component handles visual delay
        currentDraw.value = selected;
        winners.value = [...winners.value, ...selected];

        setTimeout(() => {
            isDrawing.value = false;
        }, 500); // Simple debounce/lock
    };

    const remainingCount = computed(() => {
        // 如果未設定抽獎上限，剩餘人數 = 全部參與者 - 已中獎
        if (drawLimit.value === null) {
            return participants.value.length - winners.value.length;
        }

        // 已設定上限時，剩餘人數 = min(設定上限 - 已中獎, 實際可用人數)
        const actualAvailable = participants.value.length - winners.value.length;
        const remainingByLimit = Math.max(0, drawLimit.value - winners.value.length);
        return Math.min(remainingByLimit, actualAvailable);
    });

    return {
        participants,
        winners,
        currentDraw,
        isDrawing,
        drawLimit,
        addParticipants,
        clearParticipants,
        draw,
        setDrawLimit,
        setDrawLimitForce,
        remainingCount
    };
}
