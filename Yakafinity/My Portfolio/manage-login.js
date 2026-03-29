document.addEventListener("DOMContentLoaded", () => {
  if (typeof isAdminAuthenticated === "function" && isAdminAuthenticated()) {
    window.location.href = "manage.html";
    return;
  }

  const form = document.getElementById("portfolioLoginForm");
  const message = document.getElementById("portfolioLoginMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("portfolioAdminUser").value.trim();
    const password = document.getElementById("portfolioAdminPass").value;

    if (typeof loginAdmin === "function" && loginAdmin(username, password)) {
      window.location.href = "manage.html";
      return;
    }

    message.textContent = "Invalid username or password.";
  });
});
