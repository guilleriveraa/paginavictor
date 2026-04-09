// ========== CARRUSEL HERO ESTILO VIRO ==========
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // 5 segundos entre cambios

    // Función para mostrar un slide específico
    function showSlide(index) {
        // Quitar active de todos los slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Quitar active de todos los dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Ajustar índice si está fuera de rango
        if (index < 0) {
            currentSlide = slides.length - 1;
        } else if (index >= slides.length) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }

        // Activar el slide y dot correspondiente
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Siguiente slide
    function nextSlide() {
        showSlide(currentSlide + 1);
        resetInterval();
    }

    // Slide anterior
    function prevSlide() {
        showSlide(currentSlide - 1);
        resetInterval();
    }

    // Reiniciar el intervalo automático
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    // Eventos de los botones
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Eventos de los dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });

    // Iniciar el carrusel automático
    slideInterval = setInterval(nextSlide, intervalTime);

    // Pausar al hacer hover (opcional, como en Viro)
    const carruselContainer = document.querySelector('.hero-carrusel');
    if (carruselContainer) {
        carruselContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });

        carruselContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, intervalTime);
        });
    }
});