import { formatDuration, getTimePanel } from './helpers';

describe('formatDuration', () => {
    it('форматирует секунды в ММ:СС', () => {
        expect(formatDuration(125)).toBe('2:05');
        expect(formatDuration(60)).toBe('1:00');
        expect(formatDuration(0)).toBe('0:00');
    });

    it('возвращает "0:00" для некорректных значений', () => {
        expect(formatDuration(-10)).toBe('0:00');
        expect(formatDuration(NaN)).toBe('0:00');
        expect(formatDuration(null as any)).toBe('0:00');
        expect(formatDuration(undefined as any)).toBe('0:00');
    });

    it('округляет секунды вниз', () => {
        expect(formatDuration(125.9)).toBe('2:05');
        expect(formatDuration(59.99)).toBe('0:59');
    });
});

describe('getTimePanel', () => {
    it('форматирует пару значений', () => {
        expect(getTimePanel(125, 240)).toBe('2:05 / 4:00');
    });

    it('обрабатывает некорректные значения', () => {
        expect(getTimePanel(-1, -10)).toBe('0:00 / 0:00');
    });
});
