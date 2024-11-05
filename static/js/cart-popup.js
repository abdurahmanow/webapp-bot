// Функция для показа/скрытия pop-up корзины
function toggleCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.classList.toggle('hidden');
}

// Массив корзины
let cart = [];

// Добавление товара в корзину и сохранение в cookies
function addItemToCart(item) {
    cart.push(item);
    saveCartToCookies();
    displayCartItems();
}

// Отображение товаров в корзине
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        const cartItemHeader = document.createElement('div');
        cartItemHeader.classList.add('cart-item-header');

        const itemNameContainer = document.createElement('div');
        itemNameContainer.classList.add('cart-item-name-container');
        const itemName = document.createElement('span');
        itemName.classList.add('cart-item-name');
        itemName.textContent = `${item.name} (${item.size})`;
        itemNameContainer.appendChild(itemName);

        const itemPriceContainer = document.createElement('div');
        itemPriceContainer.classList.add('cart-item-price-container');
        const itemPrice = document.createElement('span');
        itemPrice.classList.add('cart-item-price');
        itemPrice.textContent = `${item.price} грн`;
        itemPriceContainer.appendChild(itemPrice);

        const removeButton = document.createElement('button');
        removeButton.classList.add('cart-item-remove-btn');
        removeButton.innerHTML = `<img src="static/img/delete.png" alt="Удалить" style="width: 20px; height: 20px;">`;
        removeButton.onclick = () => removeFromCart(index);

        cartItemHeader.appendChild(itemNameContainer);
        cartItemHeader.appendChild(itemPriceContainer);
        cartItemHeader.appendChild(removeButton);
        cartItem.appendChild(cartItemHeader);

        if (item.addons && item.addons.length > 0) {
            const addonsText = document.createElement('div');
            addonsText.classList.add('cart-item-addons');
            addonsText.textContent = `Добавки: ${item.addons.join(', ')}`;
            cartItem.appendChild(addonsText);
        }

        cartContainer.appendChild(cartItem);
    });
}

// Удаление товара из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToCookies();
    displayCartItems();
}

// Сохранение корзины в cookies на 1 час с поддержкой SameSite
function saveCartToCookies() {
    const cartJSON = JSON.stringify(cart);
    document.cookie = `cart=${encodeURIComponent(cartJSON)}; max-age=${60 * 60}; path=/; SameSite=Lax`;
}

// Загрузка корзины из cookies
function loadCartFromCookies() {
    const cookies = document.cookie.split('; ').find(row => row.startsWith('cart='));
    if (cookies) {
        cart = JSON.parse(decodeURIComponent(cookies.split('=')[1]));
        displayCartItems();
    }
}

// Загрузка корзины при открытии страницы
document.addEventListener('DOMContentLoaded', loadCartFromCookies);
