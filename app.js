document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing Swiper...');

    // Hero Swiper - ПРОСТАЯ И РАБОЧАЯ ВЕРСИЯ
    const heroSwiper = new Swiper('.hero-swiper', {
        // Основные настройки
        direction: 'horizontal',
        loop: true,
        speed: 800,
        
        // Эффект перехода
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        
        // Автопрокрутка
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        
        // Пагинация (точки)
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Навигация (стрелки)
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Клавиатура
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        
        // Отключить колесо мыши
        mousewheel: false,
        
        // Наблюдатели для динамического контента
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        
        // События
        on: {
            init: function () {
                console.log('Swiper initialized successfully!');
                console.log('Navigation elements found:', {
                    next: this.params.navigation.nextEl,
                    prev: this.params.navigation.prevEl,
                    pagination: this.params.pagination.el
                });
            },
            slideChange: function () {
                console.log('Slide changed to:', this.activeIndex);
            }
        }
    });

    // УБИРАЕМ ВЕСЬ ПАРАЛЛАКС И СЛОЖНУЮ АНИМАЦИЮ
    // Оставляем только фон для секций
    function updateBackground() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const featured = document.querySelector('.featured');
        const contact = document.querySelector('.contact-form-section');
        const extendedBg = document.querySelector('.extended-background');
        
        if (!hero) return;
        
        const heroHeight = hero.offsetHeight;
        const heroBottom = hero.offsetTop + heroHeight;
        
        // РАСШИРЕННЫЙ ФОН ДЛЯ ВСЕХ СЕКЦИЙ
        if (extendedBg) {
            if (scrolled > 100) {
                extendedBg.style.opacity = '1';
            } else {
                extendedBg.style.opacity = '0';
            }
        }
        
        // АКТИВИРУЕМ ФОН ДЛЯ СЕКЦИЙ
        if (featured) {
            if (scrolled > heroBottom - 300) {
                featured.classList.add('active-bg');
            } else {
                featured.classList.remove('active-bg');
            }
        }
        
        if (contact) {
            const featuredHeight = featured ? featured.offsetHeight : 0;
            if (scrolled > heroBottom + featuredHeight - 500) {
                contact.classList.add('active-bg');
            } else {
                contact.classList.remove('active-bg');
            }
        }
        
        // Header background on scroll
        const header = document.querySelector('.header');
        if (header) {
            if (scrolled > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    }

    // ГЛОБАЛЬНЫЙ ОБЪЕКТ ДЛЯ ХРАНЕНИЯ ДАННЫХ ЗАПРОСА
    window.productInquiryData = null;

    // ФУНКЦИЯ ДЛЯ ПЕРЕНОСА ДАННЫХ В ФОРМУ
    function fillContactForm(productData) {
        if (!productData) return;
        
        const form = document.getElementById('feedbackForm');
        if (!form) return;
        
        // Заполняем поле сообщения
        const messageField = document.getElementById('message');
        if (messageField && productData.name && productData.price) {
            const inquiryText = `Здравствуйте! Меня интересует товар: ${productData.name} (${productData.price}). Пожалуйста, предоставьте дополнительную информацию.`;
            messageField.value = inquiryText;
        }
        
        // Прокручиваем к форме
        const contactSection = document.querySelector('.contact-form-section');
        if (contactSection) {
            const offsetTop = contactSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        showNotification('Данные о товаре перенесены в форму обратной связи!');
    }

    // ОБРАБОТЧИКИ ДЛЯ КНОПОК "УЗНАТЬ ПОДРОБНОСТИ"
    const inquiryButtons = document.querySelectorAll('.inquiry-button');
    
    inquiryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3')?.textContent || 'Неизвестный товар';
            const productPrice = productCard.querySelector('.price')?.textContent || 'Цена не указана';
            
            // Сохраняем данные в глобальный объект
            window.productInquiryData = {
                name: productName,
                price: productPrice,
                timestamp: new Date().getTime()
            };
            
            console.log('Product inquiry data saved:', window.productInquiryData);
            
            // Показываем уведомление и заполняем форму
            showNotification(`Запрос по товару "${productName}" добавлен в форму обратной связи!`);
            
            // Заполняем форму
            fillContactForm(window.productInquiryData);
        });
    });

    // ОБРАБОТЧИК ДЛЯ КНОПОК "СМОТРЕТЬ КОЛЛЕКЦИЮ"
    const discoverButtons = document.querySelectorAll('.discover-button');
    
    discoverButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const collectionSection = document.querySelector('#collection');
            if (collectionSection) {
                const offsetTop = collectionSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                showNotification('Добро пожаловать в нашу коллекцию!');
            }
        });
    });

    // ОБРАБОТЧИК ДЛЯ ФОРМЫ ОБРАТНОЙ СВЯЗИ
    const contactForm = document.getElementById('feedbackForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                productInquiry: window.productInquiryData
            };
            
            // Валидация
            if (!formData.name || !formData.phone || !formData.email) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Логируем данные
            console.log('Form submitted with data:', formData);
            
            // Показываем уведомление об успехе
            let successMessage = 'Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.';
            if (formData.productInquiry) {
                successMessage += `\nЗапрос по товару: ${formData.productInquiry.name}`;
            }
            
            showNotification(successMessage);
            
            // Очищаем форму и данные о товаре
            contactForm.reset();
            window.productInquiryData = null;
        });
    }

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'success') {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        if (message.includes('\n')) {
            message.split('\n').forEach((line, index) => {
                const p = document.createElement('div');
                p.textContent = line;
                if (index > 0) p.style.marginTop = '5px';
                notification.appendChild(p);
            });
        } else {
            notification.textContent = message;
        }
        
        const backgroundColor = type === 'error' ? '#e74c3c' : '#27ae60';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            font-weight: 500;
            white-space: pre-line;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Инициализация при загрузке
    setTimeout(() => {
        updateBackground();
    }, 1000);

    // Слушаем событие скролла
    window.addEventListener('scroll', updateBackground);

    console.log('All features initialized successfully!');
});
