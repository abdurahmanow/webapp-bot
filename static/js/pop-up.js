// Открытие pop-up для выбора добавок
function openOptionsPopup(item) {
    selectedItem = {
        ...item,
        size: selectedSize[item.id] || 'Средний'
    };
    const optionsPopup = document.getElementById('options-popup');
    optionsPopup.classList.remove('hidden');

    const addonOptions = document.getElementById('addon-options');
    addonOptions.innerHTML = '';

    // Создаем опцию "Без добавок" с активной областью
    const noAddonOption = document.createElement('div');
    noAddonOption.classList.add('addon-option', 'selected'); // Добавляем класс "selected" по умолчанию
    const noAddonCheckbox = document.createElement('input');
    noAddonCheckbox.type = 'radio';
    noAddonCheckbox.name = 'addon';
    noAddonCheckbox.value = '';
    noAddonCheckbox.id = 'no-addon';
    noAddonCheckbox.checked = true;

    const noAddonLabel = document.createElement('label');
    noAddonLabel.htmlFor = 'no-addon';
    noAddonLabel.textContent = 'Без добавок';

    noAddonOption.appendChild(noAddonCheckbox);
    noAddonOption.appendChild(noAddonLabel);
    addonOptions.appendChild(noAddonOption);

    // Обработка клика на "Без добавок"
    noAddonOption.addEventListener('click', () => {
        document.querySelectorAll('.addon-option').forEach(option => option.classList.remove('selected'));
        noAddonOption.classList.add('selected');
        noAddonCheckbox.checked = true;
        clearSelectedAddons(); // Снимаем все добавки
    });

    // Создаем опции для каждой добавки
    item.addons.forEach(addon => {
        const addonOption = document.createElement('div');
        addonOption.classList.add('addon-option'); // Добавляем класс для CSS

        const addonCheckbox = document.createElement('input');
        addonCheckbox.type = 'checkbox';
        addonCheckbox.value = addon;
        addonCheckbox.id = `addon-${addon}`;

        const addonLabel = document.createElement('label');
        addonLabel.htmlFor = `addon-${addon}`;
        addonLabel.textContent = addon;

        // Обработка выбора добавки
        addonOption.addEventListener('click', () => {
            addonCheckbox.checked = !addonCheckbox.checked;
            addonOption.classList.toggle('selected', addonCheckbox.checked);

            // Если выбрана хотя бы одна добавка, "Без добавок" деактивируется
            const anyAddonSelected = Array.from(document.querySelectorAll('#addon-options input[type="checkbox"]:checked')).length > 0;
            noAddonCheckbox.checked = !anyAddonSelected;
            noAddonOption.classList.toggle('selected', !anyAddonSelected);
        });

        addonOption.appendChild(addonCheckbox);
        addonOption.appendChild(addonLabel);
        addonOptions.appendChild(addonOption);
    });
}

// Сброс всех выбранных добавок
function clearSelectedAddons() {
    const addonCheckboxes = document.querySelectorAll('#addon-options input[type="checkbox"]');
    addonCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.parentElement.classList.remove('selected');
    });
}

// Закрытие pop-up
function toggleOptionsPopup() {
    const optionsPopup = document.getElementById('options-popup');
    optionsPopup.classList.toggle('hidden');
}

// Добавление товара в корзину с выбранными добавками
function addToCartWithOptions() {
    const selectedAddons = [];
    const addonCheckboxes = document.querySelectorAll('#addon-options input[type="checkbox"]:checked');
    addonCheckboxes.forEach(checkbox => {
        selectedAddons.push(checkbox.value);
    });

    addItemToCart({
        ...selectedItem,
        addons: selectedAddons
    });
    toggleOptionsPopup();
    displayCartItems();
}
