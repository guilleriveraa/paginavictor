// ========== SISTEMA DE TRADUCCIÓN ==========

// Cargar traducciones desde archivo JSON
let translations = null;
let currentLang = localStorage.getItem('language') || 'es';

// Función para cargar el archivo JSON
async function loadTranslations() {
    try {
        const response = await fetch('js/translations.json');
        if (!response.ok) throw new Error('Error cargando traducciones');
        translations = await response.json();
        return true;
    } catch (error) {
        console.error('Error al cargar traducciones:', error);
        return false;
    }
}

// Función para aplicar traducciones a la página
function applyTranslations() {
    if (!translations) return;

    const langData = translations[currentLang];
    if (!langData) return;

    // Traducir elementos con atributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            // Si es input o textarea, traducir placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
                if (element.getAttribute('placeholder') && langData[key]) {
                    element.placeholder = langData[key];
                }
            } else {
                element.textContent = langData[key];
            }
        }
    });

    // Actualizar el atributo lang del html
    document.documentElement.lang = currentLang === 'es' ? 'es' : 'en';

    // Actualizar clase activa de los botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    console.log(`Idioma cambiado a: ${currentLang}`);
}

// Función para cambiar el idioma
async function changeLanguage(lang) {
    if (!translations) {
        await loadTranslations();
    }
    currentLang = lang;
    localStorage.setItem('language', lang);
    applyTranslations();
}

// Función para inicializar el sistema de traducción
async function initTranslations() {
    const loaded = await loadTranslations();
    if (loaded) {
        applyTranslations();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initTranslations();

    // Configurar eventos de los botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.getAttribute('data-lang');
            if (lang && lang !== currentLang) {
                changeLanguage(lang);
            }
        });
    });
});