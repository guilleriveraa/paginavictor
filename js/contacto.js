// ========== MENÚ MÓVIL ==========
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ========== FORMULARIO DINÁMICO SEGÚN MOTIVO ==========
const motivoSelect = document.getElementById('motivo');
const eventoRow = document.getElementById('eventoRow');
const invitadosRow = document.getElementById('invitadosRow');
const espacioGroup = document.getElementById('espacioGroup');
const mensajeTextarea = document.getElementById('mensaje');

// Textos de ejemplo según el motivo
const placeholders = {
    reserva: "Cuéntanos sobre tu evento:\n- Tipo de evento\n- Fecha aproximada\n- Número de invitados\n- ¿Necesitas espacio? (sí/no)\n- Presupuesto estimado\n- Alguna preferencia especial?",
    consulta: "Escribe aquí tu consulta. Te responderemos lo antes posible.",
    menu: "¿Qué tipo de menú te interesa?\n- ¿Para cuántas personas?\n- ¿Alguna alergia o restricción dietética?\n- ¿Prefieres degustación, cóctel o buffet?",
    espacio: "¿Qué espacio te interesa?\n- ¿Para qué fecha?\n- ¿Número aproximado de invitados?\n- ¿Prefieres interior o exterior?"
};

if (motivoSelect) {
    motivoSelect.addEventListener('change', () => {
        const motivo = motivoSelect.value;

        // Mostrar/ocultar campos según el motivo
        if (motivo === 'reserva') {
            if (eventoRow) eventoRow.style.display = 'flex';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.reserva;
            // Hacer campos obligatorios para reserva
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = true;
            if (fechaField) fechaField.required = true;
            if (invitadosField) invitadosField.required = true;
        } else if (motivo === 'espacio') {
            if (eventoRow) eventoRow.style.display = 'flex';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'block';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.espacio;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = false;
            if (fechaField) fechaField.required = false;
            if (invitadosField) invitadosField.required = false;
        } else if (motivo === 'menu') {
            if (eventoRow) eventoRow.style.display = 'none';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.menu;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = false;
            if (fechaField) fechaField.required = false;
            if (invitadosField) invitadosField.required = false;
        } else if (motivo === 'consulta') {
            if (eventoRow) eventoRow.style.display = 'none';
            if (invitadosRow) invitadosRow.style.display = 'none';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = placeholders.consulta;
            const eventoField = document.getElementById('evento');
            const fechaField = document.getElementById('fecha');
            const invitadosField = document.getElementById('invitados');
            if (eventoField) eventoField.required = false;
            if (fechaField) fechaField.required = false;
            if (invitadosField) invitadosField.required = false;
        } else {
            if (eventoRow) eventoRow.style.display = 'flex';
            if (invitadosRow) invitadosRow.style.display = 'flex';
            if (espacioGroup) espacioGroup.style.display = 'none';
            if (mensajeTextarea) mensajeTextarea.placeholder = "Escribe aquí tu mensaje...";
        }
    });
}

// ========== FORMULARIO CON RESEND ==========
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.querySelector('.btn-enviar');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Guardar texto original del botón
        const originalText = submitBtn.innerHTML;

        // Mostrar estado de carga
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Recoger datos del formulario
        const formData = {
            nombre: document.getElementById('nombre')?.value || '',
            email: document.getElementById('email')?.value || '',
            telefono: document.getElementById('telefono')?.value || '',
            motivo: document.getElementById('motivo')?.value || '',
            evento: document.getElementById('evento')?.value || '',
            fecha: document.getElementById('fecha')?.value || '',
            invitados: document.getElementById('invitados')?.value || '',
            espacioInteres: document.getElementById('espacioInteres')?.value || '',
            mensaje: document.getElementById('mensaje')?.value || ''
        };

        try {
            // Enviar a tu servidor local
            const response = await fetch('http://localhost/viro/api/enviar-contacto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Éxito
                formMessage.innerHTML = `
                    <div class="alert-success">
                        <i class="fas fa-check-circle"></i> 
                        ¡Mensaje enviado correctamente! Te responderemos en menos de 24 horas.
                    </div>
                `;
                form.reset();
                // Resetear visibilidad de campos
                if (eventoRow) eventoRow.style.display = 'flex';
                if (invitadosRow) invitadosRow.style.display = 'flex';
                if (espacioGroup) espacioGroup.style.display = 'none';
            } else {
                throw new Error(result.error || 'Error al enviar');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.innerHTML = `
                <div class="alert-error">
                    <i class="fas fa-exclamation-triangle"></i> 
                    Error al enviar. Asegúrate de que el servidor esté corriendo en http://localhost:3000
                </div>
            `;
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                if (formMessage) formMessage.innerHTML = '';
            }, 5000);
        }
    });
}