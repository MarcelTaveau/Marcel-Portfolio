// Select nav links and toggle button
const links = document.querySelectorAll('nav a');
const toggleButton = document.getElementById('lang-toggle');

// Determine initial language based on browser
let isFrench = false;
const userLang = navigator.language || navigator.userLanguage;
if (userLang.startsWith('fr')) {
    isFrench = true;
}

// Function to update language display
function updateLanguage() {
    // Update page content
    document.querySelectorAll('.lang').forEach(el => {
        if (isFrench) {
            if (el.classList.contains('en')) el.style.display = 'none';
            else if (el.classList.contains('fr')) el.style.display = 'block';
        } else {
            if (el.classList.contains('fr')) el.style.display = 'none';
            else if (el.classList.contains('en')) el.style.display = 'block';
        }
    });

    // Update nav link text
    links.forEach(link => {
        link.textContent = isFrench ? link.dataset.fr : link.dataset.en;
    });
}

// Initialize page language
updateLanguage();

// Manual toggle button
toggleButton.addEventListener('click', () => {
    isFrench = !isFrench;
    updateLanguage();
});
