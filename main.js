// Переменная для хранения данных меню и выбранного размера товара
let menuData = [];
let selectedSize = {};
let selectedItem = {};
let activeCategoryId = null; // Добавляем переменную для отслеживания активной категории

// Функция для загрузки меню и категорий
async function fetchMenuItems() {
    try {
        // Замените URL на путь к локальному файлу JSON
        const response = await fetch('test_data.json');
        const data = await response.json();
        menuData = data.categories;
        displayCategories(menuData);
        activeCategoryId = menuData[0].id; // Устанавливаем первую категорию активной по умолчанию
        displayItems(menuData[0].items); // Отображаем товары первой категории по умолчанию
        updateActiveCategoryButton(); // Устанавливаем активную категорию по умолчанию
    } catch (error) {
        console.error('Ошибка при загрузке меню:', error);
    }
}


// Функция для отображения категорий с активной категорией
function displayCategories(categories) {
    const categoryNav = document.getElementById('category-nav');
    categoryNav.innerHTML = '';

    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-btn');
        button.textContent = category.name;

        // Устанавливаем класс "active" для активной категории
        if (category.id === activeCategoryId) {
            button.classList.add('active');
        }

        button.onclick = () => {
            activeCategoryId = category.id; // Обновляем активную категорию
            filterItemsByCategory(category.id);
            updateActiveCategoryButton(); // Обновляем стиль активной категории
        };
        
        categoryNav.appendChild(button);
    });
}

// Функция для обновления стиля активной категории
function updateActiveCategoryButton() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach((button, index) => {
        const categoryId = menuData[index].id;
        if (categoryId === activeCategoryId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Функция для фильтрации товаров по категории
function filterItemsByCategory(categoryId) {
    const category = menuData.find(cat => cat.id === categoryId);
    if (category) {
        displayItems(category.items);
        activeCategoryId = categoryId; // Обновляем активную категорию
        updateActiveCategoryButton(); // Обновляем активную кнопку после отображения товаров
    }
}

// Функция для отображения товаров
function displayItems(items) {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');

        // Отображение доступных размеров товара
        const sizesHTML = item.sizes && item.sizes.length > 0 ? item.sizes.map((size, index) => `
            <button class="size-btn ${index === 0 ? 'active' : ''}" onclick="selectSize(${item.id}, '${size}', this)">
                ${size}
            </button>
        `).join('') : '';

        // Устанавливаем первый размер по умолчанию, если размеры есть
        if (item.sizes && item.sizes.length > 0) {
            selectedSize[item.id] = item.sizes[0];
        }

        // Карточка товара
        itemCard.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-info">
                <span class="item-price">${item.price} грн</span>
                <span class="item-weight">${item.weight}</span>
            </div>
            <div class="size-options">${sizesHTML}</div>
            <button class="cart-btn" onclick="handleAddToCart(${item.id})">В корзину</button>
        `;
        menuContainer.appendChild(itemCard);
    });
}

// Выбор размера товара
function selectSize(itemId, size, button) {
    const sizeButtons = button.parentNode.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    selectedSize[itemId] = size;
}

// Обработка кнопки "В корзину" с учетом добавок
function handleAddToCart(itemId) {
    const item = menuData.flatMap(cat => cat.items).find(it => it.id === itemId);
    if (item.addons && item.addons.length > 0) {
        openOptionsPopup(item); // Открываем pop-up для выбора добавок
    } else {
        addToCart(item); // Добавляем товар сразу в корзину, если добавок нет
    }
}

// Добавление товара в корзину без добавок
function addToCart(item) {
    addItemToCart({
        ...item,
        size: selectedSize[item.id] || 'Средний',
        addons: [] // Пустой массив, если нет добавок
    });
    displayCartItems();
}

// Инициализация загрузки меню
document.addEventListener('DOMContentLoaded', fetchMenuItems);

// Проверка ориентации и ширины экрана
function checkScreenOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = width > height ? 'landscape' : 'portrait';

    if (orientation === 'landscape' && width <= 720) {
        document.body.classList.add('landscape');
    } else {
        document.body.classList.remove('landscape');
    }
}

// Обновляем интерфейс при изменении ориентации устройства
window.addEventListener('resize', checkScreenOrientation);
window.addEventListener('orientationchange', checkScreenOrientation);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', checkScreenOrientation);
