document.addEventListener('DOMContentLoaded', init);

function init() {
    initActiveNav();
    initMenuToggle();
    initThemeToggle();
    initBackToTop();
    initCurrentYear();
    initAccordion();
    initFilters();
    initModal();
    initContactForm();
}

function initActiveNav() {
    const links = document.querySelectorAll('.nav-list a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach((link) => {
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initMenuToggle() {
    const menuButton = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (!menuButton || !siteNav) return;

    menuButton.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                siteNav.classList.remove('is-open');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function initThemeToggle() {
    const themeButton = document.querySelector('.theme-toggle');
    const body = document.body;
    const storageKey = 'siteTheme';

    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme === 'dark') {
        body.classList.add('theme-dark');
    }

    if (!themeButton) return;

    themeButton.addEventListener('click', () => {
        body.classList.toggle('theme-dark');
        const currentTheme = body.classList.contains('theme-dark') ? 'dark' : 'light';
        localStorage.setItem(storageKey, currentTheme);
    });
}

function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.hidden = false;
        } else {
            backToTopButton.hidden = true;
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = currentYear;
    });
}

function initAccordion() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    if (!accordionTriggers.length) return;

    accordionTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            if (!content) return;

            accordionTriggers.forEach((otherTrigger) => {
                const otherContent = otherTrigger.nextElementSibling;
                if (otherTrigger !== trigger && otherContent) {
                    otherContent.hidden = true;
                }
            });

            content.hidden = !content.hidden;
        });
    });
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.service-card');

    if (!filterButtons.length || !cards.length) return;

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;

            cards.forEach((card) => {
                const match = category === 'all' || card.dataset.category === category;
                card.hidden = !match;
            });
        });
    });
}

function initModal() {
    const modal = document.querySelector('#image-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    const triggerImage = document.querySelector('.modal-image-trigger');

    if (!modal || !modalImage || !modalClose || !modalOverlay || !triggerImage) return;

    triggerImage.addEventListener('click', () => {
        modal.hidden = false;
        modalImage.src = triggerImage.src;
        modalImage.alt = triggerImage.alt;
    });

    modalClose.addEventListener('click', () => {
        modal.hidden = true;
    });

    modalOverlay.addEventListener('click', () => {
        modal.hidden = true;
    });
}

function initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const messageInput = document.querySelector('#message');
    const agreeInput = document.querySelector('#agree');
    const resultBlock = document.querySelector('#form-result');
    const clearDraftButton = document.querySelector('.clear-draft-btn');
    const messageCounter = document.querySelector('#message-counter');

    const nameError = document.querySelector('#name-error');
    const emailError = document.querySelector('#email-error');
    const messageError = document.querySelector('#message-error');
    const agreeError = document.querySelector('#agree-error');

    const draftKey = 'contactDraft';

    function updateCounter() {
        if (!messageInput || !messageCounter) return;
        const currentLength = messageInput.value.length;
        const maxLength = Number(messageInput.getAttribute('maxlength')) || 200;
        messageCounter.textContent = `${currentLength} / ${maxLength}`;
    }

    function saveDraft() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (agreeInput) {
            data.agree = agreeInput.checked;
        }
        localStorage.setItem(draftKey, JSON.stringify(data));
    }

    function restoreDraft() {
        const savedDraft = JSON.parse(localStorage.getItem(draftKey) || '{}');

        if (nameInput && savedDraft.name) nameInput.value = savedDraft.name;
        if (emailInput && savedDraft.email) emailInput.value = savedDraft.email;
        if (messageInput && savedDraft.message) messageInput.value = savedDraft.message;

        const phoneInput = document.querySelector('#phone');
        const topicInput = document.querySelector('#topic');

        if (phoneInput && savedDraft.phone) phoneInput.value = savedDraft.phone;
        if (topicInput && savedDraft.topic) topicInput.value = savedDraft.topic;

        if (savedDraft.contactWay) {
            const selectedRadio = form.querySelector(`input[name="contactWay"][value="${savedDraft.contactWay}"]`);
            if (selectedRadio) selectedRadio.checked = true;
        }

        if (agreeInput && typeof savedDraft.agree === 'boolean') {
            agreeInput.checked = savedDraft.agree;
        }

        updateCounter();
    }

    function clearErrors() {
        if (nameError) nameError.textContent = '';
        if (emailError) emailError.textContent = '';
        if (messageError) messageError.textContent = '';
        if (agreeError) agreeError.textContent = '';
    }

    function validateForm() {
        clearErrors();
        let isValid = true;

        if (nameInput && nameInput.value.trim().length < 2) {
            nameError.textContent = 'Ім’я має містити мінімум 2 символи.';
            isValid = false;
        }

        if (emailInput) {
            const emailValue = emailInput.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(emailValue)) {
                emailError.textContent = 'Введіть коректний email.';
                isValid = false;
            }
        }

        if (messageInput && messageInput.value.trim() === '') {
            messageError.textContent = 'Повідомлення не може бути порожнім.';
            isValid = false;
        }

        if (agreeInput && !agreeInput.checked) {
            agreeError.textContent = 'Потрібно погодитися з правилами.';
            isValid = false;
        }

        return isValid;
    }

    form.addEventListener('input', () => {
        saveDraft();
        updateCounter();
    });

    form.addEventListener('change', () => {
        saveDraft();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (resultBlock) {
            resultBlock.hidden = false;
            resultBlock.innerHTML = `
                <h2>Форму успішно оброблено</h2>
                <p><strong>Ім’я:</strong> ${data.name || ''}</p>
                <p><strong>Email:</strong> ${data.email || ''}</p>
                <p><strong>Телефон:</strong> ${data.phone || ''}</p>
                <p><strong>Тема:</strong> ${data.topic || ''}</p>
                <p><strong>Спосіб зв’язку:</strong> ${data.contactWay || ''}</p>
                <p><strong>Повідомлення:</strong> ${data.message || ''}</p>
            `;
        }

        localStorage.removeItem(draftKey);
        form.reset();
        updateCounter();
    });

    if (clearDraftButton) {
        clearDraftButton.addEventListener('click', () => {
            localStorage.removeItem(draftKey);
            form.reset();
            clearErrors();
            if (resultBlock) {
                resultBlock.hidden = true;
                resultBlock.innerHTML = '';
            }
            updateCounter();
        });
    }

    restoreDraft();
    updateCounter();
}