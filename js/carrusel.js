// ========== CARRUSEL HERO CON AUTO-REPRODUCCIÓN ==========
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar elementos
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    // Verificar que hay slides
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;
    let isPlaying = true;
    const INTERVAL_TIME = 5000; // 5 segundos entre cambios

    // Función para mostrar un slide específico
    function showSlide(index) {
        // Validar índice
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // Cambiar slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        // Cambiar dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    // Siguiente slide (avance automático)
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Iniciar reproducción automática
    function startAutoPlay() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            nextSlide();
            console.log('Auto-cambio a slide', (currentSlide + 1) % slides.length); // Para debug
        }, INTERVAL_TIME);
        isPlaying = true;
    }

    // Detener reproducción automática
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
            isPlaying = false;
        }
    }

    // Reiniciar auto-reproducción
    function resetAutoPlay() {
        if (isPlaying) {
            stopAutoPlay();
            startAutoPlay();
        }
    }

    // Eventos de los botones
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    // Eventos de los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });

    // Pausar al hacer hover (opcional, como en Viro)
    const carruselContainer = document.querySelector('.hero-carrusel');
    if (carruselContainer) {
        carruselContainer.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });

        carruselContainer.addEventListener('mouseleave', () => {
            if (!isPlaying) {
                startAutoPlay();
            }
        });
    }

    // INICIAR AUTO-REPRODUCCIÓN
    startAutoPlay();

    console.log('Carrusel iniciado - Cambia automáticamente cada', INTERVAL_TIME / 1000, 'segundos');
});