"use strict";

const DEFAULT_REVIEWS = [
    {
        name: "Игорь",
        text: "Купил сковородку — жена вернулась.",
        createdAt: "2026-03-18T12:00:00.000Z"
    },
    {
        name: "Марина",
        text: "Теперь жарю даже воздух. 10/10.",
        createdAt: "2026-03-17T12:00:00.000Z"
    },
    {
        name: "Аноним",
        text: "Сначала думал, что она мне не нужна, а теперь у меня их уже восемь.",
        createdAt: "2026-03-16T12:00:00.000Z"
    },
    {
        name: "Никита",
        text: "Сковородка пережила три переезда и всё ещё жарит как новая.",
        createdAt: "2026-03-15T12:00:00.000Z"
    }
];

const REVIEW_COOKIE_NAME = "lab4_reviews";
const THEME_COOKIE_NAME = "lab4_theme";
const MAX_REVIEWS = 8;
const NAME_PATTERN = /^[A-Za-zА-Яа-яЁё\s-]+$/;

const reviewsList = document.getElementById("reviews-list");
const reviewForm = document.getElementById("review-form");
const nameInput = document.getElementById("name");
const textInput = document.getElementById("review-text");
const formMessage = document.getElementById("review-form-message");
const themeToggle = document.getElementById("theme-toggle");

const state = {
    reviews: loadReviews(),
    isDarkTheme: loadThemePreference()
};

renderReviews(state.reviews);
applyTheme(state.isDarkTheme);

reviewForm.addEventListener("submit", handleReviewSubmit);
themeToggle.addEventListener("click", handleThemeToggle);

function loadReviews() {
    const savedValue = window.cookieUtils?.getCookie(REVIEW_COOKIE_NAME);

    if (!savedValue) {
        return DEFAULT_REVIEWS.slice();
    }

    try {
        const parsedReviews = JSON.parse(savedValue);

        if (!Array.isArray(parsedReviews)) {
            return DEFAULT_REVIEWS.slice();
        }

        const normalizedReviews = parsedReviews
            .map(normalizeReview)
            .filter(Boolean)
            .slice(0, MAX_REVIEWS);

        return normalizedReviews.length > 0 ? normalizedReviews : DEFAULT_REVIEWS.slice();
    } catch (error) {
        return DEFAULT_REVIEWS.slice();
    }
}

function loadThemePreference() {
    return window.cookieUtils?.getCookie(THEME_COOKIE_NAME) === "dark";
}

function normalizeReview(review) {
    if (!review || typeof review !== "object") {
        return null;
    }

    const name = typeof review.name === "string" ? review.name.trim() : "";
    const text = typeof review.text === "string" ? review.text.trim() : "";
    const createdAt = typeof review.createdAt === "string" ? review.createdAt : "";

    if (!name || !text || !createdAt) {
        return null;
    }

    return { name, text, createdAt };
}

function renderReviews(reviews) {
    reviewsList.innerHTML = "";

    reviews.forEach((review) => {
        const reviewCard = document.createElement("article");
        reviewCard.className = "review-card";

        const reviewHeader = document.createElement("div");
        reviewHeader.className = "review-card-header";

        const reviewAuthor = document.createElement("strong");
        reviewAuthor.className = "review-author";
        reviewAuthor.textContent = review.name;

        const reviewDate = document.createElement("time");
        reviewDate.className = "review-date";
        reviewDate.dateTime = review.createdAt;
        reviewDate.textContent = formatReviewDate(review.createdAt);

        const reviewText = document.createElement("p");
        reviewText.className = "review-text";
        reviewText.textContent = `«${review.text}»`;

        reviewHeader.append(reviewAuthor, reviewDate);
        reviewCard.append(reviewHeader, reviewText);
        reviewsList.append(reviewCard);
    });
}

function formatReviewDate(isoDate) {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return "Дата неизвестна";
    }

    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

function handleReviewSubmit(event) {
    event.preventDefault();
    clearFormMessage();

    const reviewData = {
        name: nameInput.value.trim(),
        text: textInput.value.trim()
    };

    const validationResult = validateReview(reviewData);

    if (!validationResult.isValid) {
        showFormMessage(validationResult.message, "error");
        setInvalidField(validationResult.field);
        return;
    }

    const review = {
        ...reviewData,
        createdAt: new Date().toISOString()
    };

    state.reviews = [review, ...state.reviews].slice(0, MAX_REVIEWS);
    const isSaved = saveReviews(state.reviews);
    renderReviews(state.reviews);
    reviewForm.reset();
    clearInvalidState();
    nameInput.focus();
}

function validateReview(review) {
    if (review.name.length < 2) {
        return {
            isValid: false,
            field: "name",
            message: "Имя должно содержать минимум 2 символа."
        };
    }

    if (!NAME_PATTERN.test(review.name)) {
        return {
            isValid: false,
            field: "name",
            message: "В имени допустимы только буквы, пробелы и дефис."
        };
    }

    if (review.text.length < 5) {
        return {
            isValid: false,
            field: "text",
            message: "Текст отзыва должен содержать минимум 5 символов."
        };
    }

    if (review.text.length > 200) {
        return {
            isValid: false,
            field: "text",
            message: "Текст отзыва не должен превышать 200 символов."
        };
    }

    return { isValid: true };
}

function setInvalidField(field) {
    clearInvalidState();

    if (field === "name") {
        nameInput.setAttribute("aria-invalid", "true");
        nameInput.focus();
        return;
    }

    if (field === "text") {
        textInput.setAttribute("aria-invalid", "true");
        textInput.focus();
    }
}

function clearInvalidState() {
    nameInput.removeAttribute("aria-invalid");
    textInput.removeAttribute("aria-invalid");
}

function saveReviews(reviews) {
    if (!window.cookieUtils) {
        return false;
    }

    const serializedReviews = JSON.stringify(reviews);

    window.cookieUtils.setCookie(REVIEW_COOKIE_NAME, serializedReviews, {
        expires: getFutureDate(14)
    });

    return window.cookieUtils.getCookie(REVIEW_COOKIE_NAME) === serializedReviews;
}

function getFutureDate(daysAhead) {
    const date = new Date();
    date.setDate(date.getDate() + daysAhead);
    return date;
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.classList.remove("is-error", "is-success");
    formMessage.classList.add(type === "success" ? "is-success" : "is-error");
}

function clearFormMessage() {
    formMessage.textContent = "";
    formMessage.classList.remove("is-error", "is-success");
}

function handleThemeToggle() {
    state.isDarkTheme = !state.isDarkTheme;
    applyTheme(state.isDarkTheme);

    window.cookieUtils?.setCookie(THEME_COOKIE_NAME, state.isDarkTheme ? "dark" : "light", {
        expires: getFutureDate(30)
    });
}

function applyTheme(isDarkTheme) {
    document.body.classList.toggle("dark-theme", isDarkTheme);
    themeToggle.setAttribute("aria-pressed", String(isDarkTheme));
    themeToggle.textContent = isDarkTheme ? "Светлая тема" : "Тёмная тема";
}
