// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// Данные о кейсах и их содержимом
const casesData = {
    1: {
        name: "Стартовый кейс",
        price: 100,
        items: [
            { name: "AK-47 | Redline", price: 150, rarity: "rare", image: "https://picsum.photos/seed/ak47redline/200/200.jpg" },
            { name: "AWP | Dragon Lore", price: 500, rarity: "legendary", image: "https://picsum.photos/seed/awpdragon/200/200.jpg" },
            { name: "Glock-18 | Water Elemental", price: 80, rarity: "common", image: "https://picsum.photos/seed/glockwater/200/200.jpg" },
            { name: "USP-S | Kill Confirmed", price: 120, rarity: "rare", image: "https://picsum.photos/seed/uspkill/200/200.jpg" },
            { name: "Knife | Fade", price: 300, rarity: "epic", image: "https://picsum.photos/seed/knifefade/200/200.jpg" }
        ]
    },
    2: {
        name: "Премиум кейс",
        price: 250,
        items: [
            { name: "AK-47 | Fire Serpent", price: 400, rarity: "epic", image: "https://picsum.photos/seed/ak47fire/200/200.jpg" },
            { name: "AWP | Medusa", price: 800, rarity: "legendary", image: "https://picsum.photos/seed/awpmedusa/200/200.jpg" },
            { name: "Desert Eagle | Blaze", price: 200, rarity: "rare", image: "https://picsum.photos/seed/deagleblaze/200/200.jpg" },
            { name: "M4A4 | Howl", price: 600, rarity: "legendary", image: "https://picsum.photos/seed/m4howl/200/200.jpg" },
            { name: "Knife | Doppler", price: 450, rarity: "epic", image: "https://picsum.photos/seed/knifedoppler/200/200.jpg" }
        ]
    }
};

// Модальное окно для результатов открытия кейса
const modal = document.createElement('div');
modal.className = 'modal';
modal.innerHTML = `
    <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Вы получили:</h2>
        <div class="case-result">
            <div class="item-image">
                <img src="" alt="Предмет">
            </div>
            <div class="item-name"></div>
            <div class="item-price"></div>
            <button class="continue-button">Продолжить</button>
        </div>
    </div>
`;
document.body.appendChild(modal);

// Элементы для работы с балансом
const balanceElement = document.querySelector('.balance-amount');
let userBalance = 1000; // Начальный баланс

// Обновление баланса
function updateBalance(amount) {
    userBalance += amount;
    balanceElement.textContent = userBalance;
}

// Функция для открытия кейса
function openCase(caseId) {
    const caseData = casesData[caseId];

    // Проверяем достаточно ли средств
    if (userBalance < caseData.price) {
        showNotification('Недостаточно средств для открытия этого кейса!');
        return;
    }

    // Списываем стоимость кейса
    updateBalance(-caseData.price);

    // Определяем выпавший предмет (случайный выбор)
    const totalWeight = caseData.items.reduce((sum, item) => {
        // Вес предмета зависит от его редкости
        let weight = 10; // Базовый вес для обычных предметов
        if (item.rarity === 'rare') weight = 7;
        if (item.rarity === 'epic') weight = 4;
        if (item.rarity === 'legendary') weight = 1;
        return sum + weight;
    }, 0);

    let random = Math.random() * totalWeight;
    let selectedItem = null;

    for (const item of caseData.items) {
        let weight = 10;
        if (item.rarity === 'rare') weight = 7;
        if (item.rarity === 'epic') weight = 4;
        if (item.rarity === 'legendary') weight = 1;

        random -= weight;
        if (random <= 0) {
            selectedItem = item;
            break;
        }
    }

    // Показываем результат в модальном окне
    showCaseResult(selectedItem);
}

// Функция для отображения результата открытия кейса
function showCaseResult(item) {
    const modalImage = modal.querySelector('.item-image img');
    const modalName = modal.querySelector('.item-name');
    const modalPrice = modal.querySelector('.item-price');

    modalImage.src = item.image;
    modalName.textContent = item.name;
    modalPrice.textContent = `Цена: ${item.price} ₽`;

    modal.style.display = 'flex';
}

// Закрытие модального окна
modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.querySelector('.continue-button').addEventListener('click', () => {
    modal.style.display = 'none';
});

// Обработчики для кнопок открытия кейсов
document.querySelectorAll('.case-button').forEach(button => {
    button.addEventListener('click', function() {
        const caseCard = this.closest('.case-card');
        const caseId = parseInt(caseCard.dataset.caseId);
        openCase(caseId);
    });
});

// Функция для показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Добавляем стили для уведомления
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = '#fff';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.zIndex = '1000';
    notification.style.fontSize = '16px';
    notification.style.maxWidth = '80%';
    notification.style.textAlign = 'center';

    document.body.appendChild(notification);

    // Удаляем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Инициализация баланса при загрузке
updateBalance(0);

// Настройка Telegram Web App
tg.ready();
tg.MainButton.isVisible = false; // Скрываем главную кнопку

// Обработчики для навигации
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Убираем активный класс у всех элементов
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });

        // Добавляем активный класс текущему элементу
        this.classList.add('active');

        // Получаем целевую страницу
        const targetPage = this.dataset.page;

        // Показываем уведомление о том, что страница в разработке
        if (targetPage !== 'cases') {
            showNotification(`Раздел "${this.querySelector('.nav-text').textContent}" находится в разработке!`);
        }
    });
});

// Устанавливаем цвет заголовка в Telegram
tg.setHeaderColor('#1e3c72');

// Устанавливаем заголовок в Telegram
tg.setHeaderColor('SkinMouze - Открытие кейсов');