const AUTH_STORAGE_KEY = "resortRegisteredUser";
const SESSION_STORAGE_KEY = "resortSession";

const selectors = {
  authMessage: document.querySelector("[data-auth-message]"),
};

const readJsonStorage = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (_error) {
    return null;
  }
};

const getRegisteredUser = () => readJsonStorage(AUTH_STORAGE_KEY);

const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const saveSession = (user) => {
  localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({
      fullName: user.fullName,
      email: user.email,
      initials: getInitials(user.fullName),
    })
  );
};

const setMessage = (message = "", state = "") => {
  if (!selectors.authMessage) return;
  selectors.authMessage.textContent = message;
  selectors.authMessage.className = "auth-message";
  if (state) selectors.authMessage.classList.add(`is-${state}`);
};

const initRegisterForm = () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmInput = document.getElementById("register-confirm-password");
  const createBtn = document.getElementById("register-submit");

  const reqLength = document.getElementById("req-length");
  const reqEmail = document.getElementById("req-email");
  const reqUpper = document.getElementById("req-upper");
  const reqLower = document.getElementById("req-lower");
  const reqNumber = document.getElementById("req-number");
  const reqMatch = document.getElementById("req-match");

  const toggleRule = (element, isValid) => {
    element.classList.toggle("valid", Boolean(isValid));
  };

  const validatePassword = () => {
    const password = passwordInput.value;
    const email = emailInput.value.trim().toLowerCase();
    const isLengthValid = password.length >= 8;
    const isEmailValid = !email || !password.toLowerCase().includes(email);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumberOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const matchesConfirmation = password.length > 0 && password === confirmInput.value;
    const isFormValid =
      nameInput.value.trim().length >= 3 &&
      emailInput.validity.valid &&
      isLengthValid &&
      isEmailValid &&
      hasUpper &&
      hasLower &&
      hasNumberOrSymbol &&
      matchesConfirmation;

    toggleRule(reqLength, isLengthValid);
    toggleRule(reqEmail, isEmailValid);
    toggleRule(reqUpper, hasUpper);
    toggleRule(reqLower, hasLower);
    toggleRule(reqNumber, hasNumberOrSymbol);
    toggleRule(reqMatch, matchesConfirmation);

    createBtn.disabled = !isFormValid;
    setMessage(
      isFormValid
        ? "Conta pronta para ser criada."
        : "Preencha os campos e cumpra todos os critérios da palavra-passe.",
      isFormValid ? "success" : ""
    );
  };

  [nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
    input.addEventListener("input", validatePassword);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (createBtn.disabled) return;

    const user = {
      fullName: nameInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      password: passwordInput.value,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    saveSession(user);
    window.location.href = "./concluido.html";
  });

  validatePassword();
};

const initLoginForm = () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const submitBtn = document.getElementById("login-submit");

  const validateForm = () => {
    const registeredUser = getRegisteredUser();
    const isValid = emailInput.validity.valid && passwordInput.value.trim().length >= 8;

    submitBtn.disabled = !isValid;

    if (!registeredUser) {
      setMessage("Ainda não existe uma conta guardada. Crie a sua conta primeiro.", "error");
      return;
    }

    setMessage(isValid ? "Pode iniciar sessão." : "", isValid ? "success" : "");
  };

  [emailInput, passwordInput].forEach((input) => input.addEventListener("input", validateForm));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitBtn.disabled) return;

    const registeredUser = getRegisteredUser();
    if (!registeredUser) {
      setMessage("Ainda não existe uma conta guardada neste navegador.", "error");
      return;
    }

    const typedEmail = emailInput.value.trim().toLowerCase();
    const typedPassword = passwordInput.value;
    const isUserValid =
      typedEmail === registeredUser.email && typedPassword === registeredUser.password;

    if (!isUserValid) {
      setMessage("Email ou palavra-passe inválidos.", "error");
      return;
    }

    saveSession(registeredUser);
    window.location.href = "../../index.html";
  });

  validateForm();
};

const initRecoveryForm = () => {
  const form = document.getElementById("recoveryForm");
  if (!form) return;

  const emailInput = document.getElementById("recovery-email");
  const submitBtn = document.getElementById("recovery-submit");

  const validateForm = () => {
    submitBtn.disabled = !emailInput.validity.valid;
  };

  emailInput.addEventListener("input", validateForm);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitBtn.disabled) return;

    const registeredUser = getRegisteredUser();
    if (!registeredUser) {
      setMessage("Nenhuma conta guardada foi encontrada para recuperar.", "error");
      return;
    }

    if (emailInput.value.trim().toLowerCase() !== registeredUser.email) {
      setMessage("O email não corresponde à conta guardada.", "error");
      return;
    }

    window.location.href = "./nova-palavra-passe.html";
  });

  validateForm();
};

const initNewPasswordForm = () => {
  const form = document.getElementById("newPasswordForm");
  if (!form) return;

  const passwordInput = document.getElementById("new-password");
  const confirmInput = document.getElementById("confirm-new-password");
  const submitBtn = document.getElementById("new-password-submit");

  const validateForm = () => {
    const password = passwordInput.value;
    const isValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) &&
      password === confirmInput.value;

    submitBtn.disabled = !isValid;
    setMessage(
      isValid ? "Nova palavra-passe pronta para ser guardada." : "",
      isValid ? "success" : ""
    );
  };

  [passwordInput, confirmInput].forEach((input) => input.addEventListener("input", validateForm));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submitBtn.disabled) return;

    const registeredUser = getRegisteredUser();
    if (!registeredUser) {
      setMessage("Nenhuma conta guardada foi encontrada.", "error");
      return;
    }

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        ...registeredUser,
        password: passwordInput.value,
      })
    );

    window.location.href = "./iniciar-sessao.html";
  });

  validateForm();
};

initRegisterForm();
initLoginForm();
initRecoveryForm();
initNewPasswordForm();
