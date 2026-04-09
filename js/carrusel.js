// ========== CARRUSEL MÚLTIPLE (para varios carruseles en la misma página) ==========
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionar todos los carruseles de la página
    const carruseles = document.querySelectorAll('.hero-carrusel');

    carruseles.forEach((carrusel, index) => {
        // Buscar elementos dentro de este carrusel específico
        const slides = carrusel.querySelectorAll('.slide');
        const dots = carrusel.querySelectorAll('.dot');
        const prevBtn = carrusel.querySelector('.slider-btn.prev');
        const nextBtn = carrusel.querySelector('.slider-btn.next');

        // Si no hay slides, saltar este carrusel
        if (slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval;
        let isPlaying = true;
        const INTERVAL_TIME = 5000; // 5 segundos

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

            // Cambiar slides (solo dentro de este carrusel)
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });

            // Cambiar dots (solo dentro de este carrusel)
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        // Siguiente slide
        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        // Slide anterior
        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        // Iniciar auto-reproducción
        function startAutoPlay() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                nextSlide();
            }, INTERVAL_TIME);
            isPlaying = true;
        }

        // Detener auto-reproducción
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

        // Eventos de los botones (solo para este carrusel)
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

        // Eventos de los dots (solo para este carrusel)
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                showSlide(i);
                resetAutoPlay();
            });
        });

        // Pausar al hacer hover (solo para este carrusel)
        carrusel.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });

        carrusel.addEventListener('mouseleave', () => {
            if (!isPlaying) {
                startAutoPlay();
            }
        });

        // INICIAR AUTO-REPRODUCCIÓN para este carrusel
        startAutoPlay();

        console.log(`Carrusel ${index + 1} iniciado - ${slides.length} slides`);
    });
});