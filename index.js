// Функция для добавления продукта
let ascendingOrder = false; // По умолчанию сортировка по убыванию
function addProduct() {
    const productName = document.getElementById("productName").value;
    const productCalories = parseFloat(document.getElementById("productCalories").value);

    if (productName && !isNaN(productCalories)) {
        const product = {
            id: new Date().getTime(), // Генерируем уникальный идентификатор
            name: productName,
            calories: productCalories
        };

        // Получаем список продуктов из localStorage
        let productList = JSON.parse(localStorage.getItem("productList")) || [];

        // Добавляем новый продукт в список
        productList.push(product);

        // Обновляем список продуктов в localStorage
        localStorage.setItem("productList", JSON.stringify(productList));

        // Очищаем поля ввода
        document.getElementById("productName").value = "";
        document.getElementById("productCalories").value = "";

        // Перерисовываем список продуктов и график
        displayProductList();
        drawChart(productList);

        // Пересчитываем и отображаем съеденные калории
        calculateTotalCalories();
    }
}

    // Функция для отображения списка продуктов
    function displayProductList() {
        const productList = JSON.parse(localStorage.getItem("productList")) || [];
        const listElement = document.getElementById("productList");
    
        listElement.innerHTML = "";
    
        for (const product of productList) {
            const li = document.createElement("li");
            li.innerHTML = `${product.name} (${product.calories} калорий) <button data-id="${product.id}" class="deleteButton">Удалить</button>`;
    
            // Добавляем обработчик события на кнопку "Удалить"
            const deleteButton = li.querySelector(".deleteButton");
            deleteButton.addEventListener("click", () => removeProduct(product.id));
    
            listElement.appendChild(li);
        }
    }

    function filterProducts() {
        const filterText = document.getElementById("productFilter").value.toLowerCase(); // Получаем введенный текст и переводим в нижний регистр
    
        const productList = JSON.parse(localStorage.getItem("productList")) || [];
        filteredProductList = productList.filter(product => product.name.toLowerCase().includes(filterText));
    
        // Обновляем список продуктов
        displayFilteredProductList(filteredProductList);
    
        // Обновляем график
        drawChart(filteredProductList);
    }
    
    // Функция для отображения отфильтрованного списка продуктов
    function displayFilteredProductList(products) {
        const listElement = document.getElementById("productList");
        listElement.innerHTML = "";
    
        for (const product of products) {
            const li = document.createElement("li");
            li.innerHTML = `${product.name} (${product.calories} калорий) <button data-id="${product.id}" class="deleteButton">Удалить</button>`;
    
            // Добавляем обработчик события на кнопку "Удалить"
            const deleteButton = li.querySelector(".deleteButton");
            deleteButton.addEventListener("click", () => removeProduct(product.id));
    
            listElement.appendChild(li);
        }
    }

    function sortProductList() {
        const productList = JSON.parse(localStorage.getItem("productList")) || [];
    
        if (ascendingOrder) {
            // Сортировка по возрастанию
            productList.sort((a, b) => a.calories - b.calories);
        } else {
            // Сортировка по убыванию
            productList.sort((a, b) => b.calories - a.calories);
        }
    
        localStorage.setItem("productList", JSON.stringify(productList));
    
        // Перерисовываем список продуктов и график после сортировки
        displayProductList();
        drawChart(productList);
    }

    function toggleSorting() {
        ascendingOrder = !ascendingOrder; // Инвертируем порядок сортировки
        sortProductList(); // Вызываем функцию сортировки
    }

    // Функция для удаления продукта
    function removeProduct(productId) {
        const productList = JSON.parse(localStorage.getItem("productList")) || [];
        const updatedList = productList.filter(item => item.id !== productId);
    
        localStorage.setItem("productList", JSON.stringify(updatedList));
        displayProductList();
        drawChart(filteredProductList);
        calculateTotalCalories();
    }

    // Функция для подсчета и отображения съеденных калорий
    function calculateTotalCalories() {
        const productList = JSON.parse(localStorage.getItem("productList")) || [];
        const totalCalories = productList.reduce((sum, product) => sum + product.calories, 0);
        document.getElementById("totalCalories").textContent = `${totalCalories} ккал`;

        // Проверяем, превышены ли целевые калории и выводим предупреждение
        const dailyGoal = parseFloat(document.getElementById("dailyGoal").value) || 0;
        if (totalCalories > dailyGoal) {
            document.getElementById("warning").textContent = "Превышен лимит калорий!";
        } else {
            document.getElementById("warning").textContent = "";
        }
    }

    // Функция для установки целевых калорий на день
    function setDailyGoal() {
        const dailyGoal = parseFloat(document.getElementById("dailyGoal").value) || 0;
        localStorage.setItem("dailyGoal", dailyGoal);
        calculateTotalCalories();
    }

    // Функция для очистки всех данных
    function clearAllData() {
        localStorage.removeItem("productList");
        localStorage.removeItem("dailyGoal");
        document.getElementById("productName").value = "";
        document.getElementById("productCalories").value = "";
        document.getElementById("dailyGoal").value = "";
        document.getElementById("totalCalories").innerText = "0 ккал";
        displayProductList();
        drawChart();
        calculateTotalCalories();
    }

    // Функция для отрисовки графика
    function drawChart(products) {
        const canvas = document.getElementById("chart");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        const maxCalories = Math.max(...products.map(product => product.calories), 0);
        const barWidth = 40;
        const xOffset = 40;
        let x = xOffset;
    
        for (const product of products) {
            const barHeight = (product.calories / maxCalories) * (canvas.height - 50);
            ctx.fillStyle = "blue";
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    
            ctx.fillStyle = "black";
            ctx.fillText(product.name, x, canvas.height - 10);
    
            x += barWidth + 20;
        }
    }

// Инициализация приложения
window.onload = function () {
    displayProductList();

    // Загружаем целевые калории на день
    const dailyGoal = parseFloat(localStorage.getItem("dailyGoal")) || 0;
    document.getElementById("dailyGoal").value = dailyGoal;
    calculateTotalCalories();
};