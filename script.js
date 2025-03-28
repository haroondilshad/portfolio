// Get current system theme preference
const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme to document
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

// Initialize theme based on system preference
applyTheme(getSystemTheme());

// Theme toggle button functionality (toggle between light and dark regardless of system)
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Always listen for system theme changes and apply them
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    applyTheme(e.matches ? 'dark' : 'light');
});

// PDF viewer toggle functionality
const togglePdfBtn = document.getElementById('togglePdf');
const pdfContainer = document.querySelector('.pdf-container');

togglePdfBtn.addEventListener('click', () => {
    const isExpanded = togglePdfBtn.getAttribute('aria-expanded') === 'true';
    togglePdfBtn.setAttribute('aria-expanded', !isExpanded);
    pdfContainer.hidden = isExpanded;
}); 