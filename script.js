// Check for saved theme preference, otherwise use system preference
const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Apply theme to document
const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Initialize theme
applyTheme(getPreferredTheme());

// Theme toggle button functionality
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

// PDF viewer toggle functionality
const togglePdfBtn = document.getElementById('togglePdf');
const pdfContainer = document.querySelector('.pdf-container');

togglePdfBtn.addEventListener('click', () => {
    const isExpanded = togglePdfBtn.getAttribute('aria-expanded') === 'true';
    togglePdfBtn.setAttribute('aria-expanded', !isExpanded);
    pdfContainer.hidden = isExpanded;
}); 