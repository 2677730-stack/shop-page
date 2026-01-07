let activeCategory = 'all';
let searchText = '';
let cart = [];

// ------------------- Фильтры -------------------
function filterProducts(category, button) {
    activeCategory = category;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    applyFilters();
}

function searchProducts(text) {
    searchText = text.toLowerCase();
    applyFilters();
}

function applyFilters() {
    document.querySelectorAll('.card').forEach(card => {
        const categories = card.dataset.category.split(' ');
        const title = card.querySelector('h2').textContent.toLowerCase();

        const matchesCategory =
            activeCategory === 'all' ||
            categories.includes(activeCategory);

        card.style.display =
            matchesCategory && title.includes(searchText)
                ? 'flex'
                : 'none';
    });
}


// ------------------- Корзина -------------------
function addToCart(name, price, button) {
    cart.push({ name, price });
    updateCart();
    flyToCart(button.closest('.card').querySelector('img'));
    playCartSound();
    jumpCartCounter();
}

function updateCart() {
    const list = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cart-total');

    list.innerHTML = '';
    let sum = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} — ${item.price} ₽ <button onclick="removeFromCart(${index})">×</button>`;
        list.appendChild(li);
        sum += item.price;
    });

    count.textContent = cart.length;
    total.textContent = `Итого: ${sum} ₽`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function toggleCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.classList.toggle('show');
}

function clearCart() {
    cart = [];
    updateCart();
}

// ------------------- Модалка заказа -------------------
function openOrder() {
    document.getElementById('cart').classList.remove('show')
    document.getElementById('orderModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden'
    
}

function closeOrder() {
    document.getElementById('orderModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = 'auto'
}

// ------------------- Отправка заказа в Telegram -------------------
function sendOrder() {
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;

    if (!contact || !address) {
        alert('Пожалуйста, заполните все поля');
        return;
    }

   // Формируем текст сообщения
    let text = '📦 Новый заказ:\n';
    text += `Контакт: ${contact}\nАдрес: ${address}\nТовары:\n`;
    cart.forEach(item => text += `- ${item.name} — ${item.price} ₽\n`);

    // ОТПРАВКА УЖЕ ЧЕРЕЗ НАШ СЕРВЕР
    fetch("/api/telegram-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
    .then(() => alert("Заказ отправлен!"))
    .catch(() => alert("Ошибка при отправке заказа. Попробуйте позже."));

    closeOrder();
    clearCart();
}
// ------------------- Анимация и звук -------------------
function flyToCart(img) {
    const flyingImg = img.cloneNode(true);
    flyingImg.classList.add('flying-img');
    document.body.appendChild(flyingImg);

    const imgRect = img.getBoundingClientRect();
    flyingImg.style.top = imgRect.top + 'px';
    flyingImg.style.left = imgRect.left + 'px';

    const cartBtn = document.getElementById('cart-btn');
    const cartRect = cartBtn.getBoundingClientRect();

    setTimeout(() => {
        flyingImg.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.1)`;
        flyingImg.style.opacity = '0';
    }, 10);

    flyingImg.addEventListener('transitionend', () => flyingImg.remove());
}

function playCartSound() {
    const audio = document.getElementById('cart-sound');
    audio.currentTime = 0;
    audio.play();
}

function jumpCartCounter() {
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('jump');
    setTimeout(() => cartBtn.classList.remove('jump'), 300);
}
function toggleSubFilters(button) {
    const group = button.parentElement;
    const sub = group.querySelector('.sub-filters');

    // закрываем другие
    document.querySelectorAll('.sub-filters').forEach(el => {
        if (el !== sub) el.style.display = 'none';
    });

    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
}
function closeSubFilters() {
  document.querySelectorAll('.sub-filters').forEach(menu => {
    menu.style.display = 'none';
  });
}
document.addEventListener('click', (e) => {
  const isFilterBtn = e.target.closest('.has-sub');
  const isMenu = e.target.closest('.sub-filters');

  // если клик не по кнопке и не по меню — закрываем всё
  if (!isFilterBtn && !isMenu) {
    document.querySelectorAll('.sub-filters').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const bar = document.querySelector('.top-bar');

    // Только для телефонов
    if (window.innerWidth > 768) return;

    const current = window.scrollY;

    // Скроллим вниз — прячем
    if (current > lastScroll && current > 50) {
        bar.classList.add('hide');
    } 
    // Скроллим вверх — показываем
    else {
        bar.classList.remove('hide');
    }

    lastScroll = current;
});
