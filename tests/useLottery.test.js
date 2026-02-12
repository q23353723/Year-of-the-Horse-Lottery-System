import { describe, it, expect, beforeEach } from 'vitest';
import { useLottery } from '../src/composables/useLottery';

describe('useLottery', () => {
    const { addParticipants, clearParticipants, draw, participants, winners, currentDraw, remainingCount } = useLottery();

    beforeEach(() => {
        clearParticipants();
    });

    it('should add participants correctly', () => {
        const data = [{ name: 'Alice' }, { name: 'Bob' }];
        addParticipants(data);
        expect(participants.value).toHaveLength(2);
        expect(participants.value[0].name).toBe('Alice');
        // Check if ID was added
        expect(participants.value[0]).toHaveProperty('id');
    });

    it('should draw a single winner', () => {
        const data = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
        addParticipants(data);

        draw(1);

        expect(winners.value).toHaveLength(1);
        expect(currentDraw.value).toHaveLength(1);
        expect(remainingCount.value).toBe(2);
    });

    it('should draw multiple winners', () => {
        const data = Array.from({ length: 20 }, (_, i) => ({ name: `User ${i}` }));
        addParticipants(data);

        draw(10);

        expect(winners.value).toHaveLength(10);
        expect(remainingCount.value).toBe(10);
    });

    it('should not draw duplicates in subsequent draws', () => {
        const data = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }];
        addParticipants(data);

        draw(1);
        const winner1 = winners.value[0];

        draw(1);
        const winner2 = winners.value[1];

        expect(winner1.id).not.toBe(winner2.id);
        expect(winners.value).toHaveLength(2);
    });

    it('should handle drawing more than available', () => {
        const data = [{ name: 'Alice' }, { name: 'Bob' }];
        addParticipants(data);

        // Try to draw 5, but only 2 available
        // Note: The implementation uses `alert`, which might fail in test environment if not mocked.
        // We should mock window.alert or modify implementation to not throw.
        // For now, let's see if vitest handles alert (jsdom usually ignores it or logs).

        // Mock alert
        global.alert = () => { };

        draw(5);
        expect(winners.value).toHaveLength(2);
    });
});
