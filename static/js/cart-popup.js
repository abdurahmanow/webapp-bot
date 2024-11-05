function toggleCartPopup() {
    const cartPopup = document.getElementById('cart-popup');
    cartPopup.classList.toggle('hidden');
}

let cart = [];

// Добавление товара в корзину и сохранение в cookies
function addItemToCart(item) {
    cart.push(item);
    saveCartToCookies();
}

// Отображение товаров в корзине
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name} (${item.size}) - ${item.price} грн</span>
            ${item.addons && item.addons.length > 0 ? `<div>Добавки: ${item.addons.join(', ')}</div>` : ''}
            <button onclick="removeFromCart(${index})">Удалить</button>
        `;
        cartContainer.appendChild(cartItem);
    });
}

// Удаление товара из корзины
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToCookies();
    displayCartItems();
}

// Сохранение корзины в cookies
function saveCartToCookies() {
    document.cookie = `cart=${JSON.stringify(cart)}; max-age=${60 * 60}; path=/`;
}

// Загрузка корзины из cookies
function loadCartFromCookies() {
    const cookies = document.cookie.split('; ').find(row => row.startsWith('cart='));
    if (cookies) {
        cart = JSON.parse(cookies.split('=')[1]);
        displayCartItems();
    }
}

// Загрузка корзины при открытии страницы
document.addEventListener('DOMContentLoaded', loadCartFromCookies);
