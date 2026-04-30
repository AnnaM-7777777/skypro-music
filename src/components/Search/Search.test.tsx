import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from './Search';

jest.mock('./Search.module.css', () => ({
    search: 'search',
    search__svg: 'search__svg',
    search__text: 'search__text',
}));

describe('Поле поиска', () => {
    describe('Рендеринг', () => {
        it('отображает инпут с плейсхолдером "Поиск"', () => {
            render(<Search onSearch={jest.fn()} />);
            expect(screen.getByPlaceholderText('Поиск')).toBeInTheDocument();
        });

        it('инпут имеет атрибуты type="search" и name="search"', () => {
            render(<Search onSearch={jest.fn()} />);
            const input = screen.getByPlaceholderText('Поиск');
            expect(input).toHaveAttribute('type', 'search');
            expect(input).toHaveAttribute('name', 'search');
        });
    });

    describe('Ввод текста', () => {
        it('вызывает onSearch с введённым значением', async () => {
            const user = userEvent.setup();
            const mockOnSearch = jest.fn();
            render(<Search onSearch={mockOnSearch} />);

            await user.type(screen.getByPlaceholderText('Поиск'), 'Rock');
            expect(mockOnSearch).toHaveBeenCalledWith('Rock');
        });

        it('вызывает onSearch при каждом изменении инпута', async () => {
            const user = userEvent.setup();
            const mockOnSearch = jest.fn();
            render(<Search onSearch={mockOnSearch} />);

            await user.type(screen.getByPlaceholderText('Поиск'), 'Hi');
            expect(mockOnSearch).toHaveBeenCalledTimes(2);
            expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'H');
            expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'Hi');
        });

        it('вызывает onSearch с пустой строкой при полной очистке', async () => {
            const user = userEvent.setup();
            const mockOnSearch = jest.fn();
            render(<Search onSearch={mockOnSearch} />);

            const input = screen.getByPlaceholderText('Поиск');
            await user.type(input, 'A{backspace}');
            expect(mockOnSearch).toHaveBeenLastCalledWith('');
        });
    });

    describe('Управляемый компонент', () => {
        it('отображает значение из стейта', async () => {
            const user = userEvent.setup();
            render(<Search onSearch={jest.fn()} />);

            const input = screen.getByPlaceholderText('Поиск');
            await user.type(input, 'Test');
            expect(input).toHaveValue('Test');
        });
    });
});
