import { formatDuration, getTimePanel } from './helpers';

describe('formatDuration', () => {
    describe('Успешное форматирование', () => {
        it('корректно форматирует целые секунды', () => {
            expect(formatDuration(125)).toBe('2:05');
            expect(formatDuration(60)).toBe('1:00');
            expect(formatDuration(3665)).toBe('61:05');
        });

        it('корректно форматирует 0 секунд', () => {
            expect(formatDuration(0)).toBe('0:00');
        });

        it('округляет дробные секунды вниз (Math.floor)', () => {
            expect(formatDuration(125.9)).toBe('2:05');
            expect(formatDuration(59.99)).toBe('0:59');
        });
    });

    describe('Покрытие всех ветвлений условия (Branch Coverage)', () => {
        // Ветка 1: !seconds === true (falsy значения)
        it('возвращает "0:00" при null', () => {
            expect(formatDuration(null as any)).toBe('0:00');
        });

        it('возвращает "0:00" при undefined', () => {
            expect(formatDuration(undefined as any)).toBe('0:00');
        });

        it('возвращает "0:00" при NaN', () => {
            expect(formatDuration(NaN)).toBe('0:00');
        });

        // Ветка 2: seconds < 0 === true
        it('возвращает "0:00" при отрицательном числе', () => {
            expect(formatDuration(-10)).toBe('0:00');
            expect(formatDuration(-1)).toBe('0:00');
        });

        // Ветка 3: условие ложно → выполняется основной блок кода
        it('проходит основную логику при валидном положительном числе', () => {
            expect(formatDuration(45)).toBe('0:45');
            expect(formatDuration(90)).toBe('1:30');
        });
    });
});

describe('getTimePanel', () => {
    it('корректно объединяет два времени', () => {
        expect(getTimePanel(125, 240)).toBe('2:05 / 4:00');
    });

    it('обрабатывает некорректные значения на обеих позициях', () => {
        expect(getTimePanel(-1, -10)).toBe('0:00 / 0:00');
        expect(getTimePanel(NaN, 100)).toBe('0:00 / 1:40');
        expect(getTimePanel(50, null as any)).toBe('0:50 / 0:00');
    });
});
