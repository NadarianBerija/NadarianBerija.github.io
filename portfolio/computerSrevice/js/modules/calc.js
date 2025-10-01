function calc() {
    const result = document.querySelector('.calculating__result span');

    const selectIds = ["cpu", "gpu", "ram", "storage", "psu", "case"];
    const selects = {};

    selectIds.forEach(id => {
        selects[id] = document.getElementById(id);

        const savedValue = localStorage.getItem(id);
        if (savedValue) {
            selects[id].value = savedValue;
        }

        selects[id].addEventListener('change', () => {
            localStorage.setItem(id, selects[id].value);
            calcTotal();
        });
    });

    function calcTotal() {
        let total = 0;
        let allSelected = true;

        selectIds.forEach(id => {
            const val = selects[id].value;
            if (!val) allSelected = false;
            else total += Number(val);
        });

        result.textContent = allSelected ? total : '_____';
    }

    async function loadComponents() {
        try {
            const response = await fetch("http://localhost:3002/components");
            const data = await response.json();

            selectIds.forEach(id => {
                const select = selects[id];
                select.innerHTML = '<option value="">--Option--</option>';

                const filtered = data.filter(item => item.category.toLowerCase() === id);
                filtered.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.price;
                    option.textContent = item.name;
                    select.appendChild(option);
                });

                const savedValue = localStorage.getItem(id);
                if (savedValue) select.value = savedValue;
            });

            calcTotal();

        } catch (error) {
            console.error("Ошибка загрузки компонентов:", error);
        }
    }

    loadComponents();
}

export default calc;
