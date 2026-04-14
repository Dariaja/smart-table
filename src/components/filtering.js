export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.value = name;
          el.textContent = name;
          return el;
        }),
      );
    });
  };

  // формирование query (ВМЕСТО фильтрации массива)
  const applyFiltering = (query, state, action) => {
    if (action) {
      const button = action.target || action;
      if (button && button.name === "clear") {
        const fieldName = button.getAttribute("data-field"); // "date" или "customer"

        let filterWrapper = button.parentElement;

        const input =
          (filterWrapper &&
            filterWrapper.querySelector &&
            filterWrapper.querySelector("input, select")) ||
          (button.closest &&
            button.closest(".table-column") &&
            button.closest(".table-column").querySelector("input, select"));
        if (input) {
          input.value = "";
        }

        if (fieldName && state && typeof state === "object") {
          if (
            state.filters &&
            Object.prototype.hasOwnProperty.call(state.filters, fieldName)
          ) {
            state.filters[fieldName] = "";
          } else {
            state[fieldName] = "";
          }
        }
      }
    }

    // @todo: #4.5 — отфильтровать данные, используя компаратор
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
