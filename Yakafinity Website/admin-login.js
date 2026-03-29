document.addEventListener("DOMContentLoaded", () => {
  if (isAdminAuthenticated()) {
    window.location.href = "admin.html";
    return;
  }

  const form = document.getElementById("adminLoginForm");
  const message = document.getElementById("adminLoginMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value;

    if (loginAdmin(username, password)) {
      window.location.href = "admin.html";
      return;
    }

    message.textContent = "Invalid username or password.";
  });
});
