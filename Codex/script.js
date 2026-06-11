const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const contactForm = document.querySelector("#contact-form");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const closeMenu = () => {
  menuToggle?.classList.remove("is-active");
  navMenu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menú");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");

  menuToggle.classList.toggle("is-active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const showFieldError = (field, message) => {
  const fieldWrapper = field.closest(".form-field");
  const errorMessage = fieldWrapper?.querySelector(".error-message");

  fieldWrapper?.classList.add("has-error");
  if (errorMessage) {
    errorMessage.textContent = message;
  }
};

const clearFieldError = (field) => {
  const fieldWrapper = field.closest(".form-field");
  const errorMessage = fieldWrapper?.querySelector(".error-message");

  fieldWrapper?.classList.remove("has-error");
  if (errorMessage) {
    errorMessage.textContent = "";
  }
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formStatus = document.querySelector("#form-status");
  const fields = {
    name: contactForm.querySelector("#name"),
    email: contactForm.querySelector("#email"),
    company: contactForm.querySelector("#company"),
    message: contactForm.querySelector("#message"),
  };

  let isValid = true;

  Object.values(fields).forEach((field) => clearFieldError(field));
  if (formStatus) {
    formStatus.textContent = "";
  }

  if (!fields.name.value.trim()) {
    showFieldError(fields.name, "Ingresá tu nombre.");
    isValid = false;
  }

  if (!fields.email.value.trim()) {
    showFieldError(fields.email, "Ingresá tu correo electrónico.");
    isValid = false;
  } else if (!isValidEmail(fields.email.value.trim())) {
    showFieldError(fields.email, "Ingresá un correo electrónico válido.");
    isValid = false;
  }

  if (!fields.company.value.trim()) {
    showFieldError(fields.company, "Ingresá el nombre de tu empresa.");
    isValid = false;
  }

  if (!fields.message.value.trim()) {
    showFieldError(fields.message, "Contanos brevemente qué necesitás.");
    isValid = false;
  } else if (fields.message.value.trim().length < 12) {
    showFieldError(fields.message, "El mensaje debe tener al menos 12 caracteres.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  contactForm.reset();
  if (formStatus) {
    formStatus.textContent = "Mensaje validado. Gracias por contactarnos; este formulario es una maqueta sin envío real.";
  }
});

contactForm?.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => clearFieldError(field));
});
