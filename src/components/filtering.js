import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((name) => {
        elements[name].append(
            ...Object.values(indexes[name]).map(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;

            const input = action.parentElement.querySelector('input');
            if (input) input.value = '';

            state[field] = '';
        }

        // дополнительная обработка диапазона (суммы)
        const from = parseFloat(state.totalFrom);
        const to = parseFloat(state.totalTo);

        if (!isNaN(from) || !isNaN(to)) {
            state.total = [from, to];
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}