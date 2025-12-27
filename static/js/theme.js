document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggle-theme");
    if (!toggleBtn) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";

    if (isDark) {
        document.body.classList.add("dark");
    }

    updateThemeIcon(isDark);

    toggleBtn.addEventListener("click", () => {
        const isDarkNow = document.body.classList.toggle("dark");
        localStorage.setItem("theme", isDarkNow ? "dark" : "light");
        updateThemeIcon(isDarkNow);
    });
});

function updateThemeIcon(isDark) {
    const icon = document.querySelector("#toggle-theme i");
    if (!icon) return;

    icon.classList.toggle("fa-moon", !isDark);
    icon.classList.toggle("fa-sun", isDark);
}
