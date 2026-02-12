import { ref, computed } from 'vue';

const participants = ref([]);
const winners = ref([]);
const currentDraw = ref([]);
const isDrawing = ref(false);

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
        return participants.value.length - winners.value.length;
    });

    return {
        participants,
        winners,
        currentDraw,
        isDrawing,
        addParticipants,
        clearParticipants,
        draw,
        remainingCount
    };
}
