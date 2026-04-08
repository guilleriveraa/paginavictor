// server.js
const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Para servir tus archivos HTML

// Inicializar Resend con tu API Key
const RESEND_API_KEY = 're_BLdVoSao_LPzYMEQngHdef4WjNmmJKwxC'; // <--- PON AQUÍ TU API KEY
const resend = new Resend(RESEND_API_KEY);

// Endpoint para enviar correo
app.post('/api/enviar-contacto', async (req, res) => {
    const { nombre, email, telefono, evento, fecha, invitados, mensaje } = req.body;

    // Validar campos
    if (!nombre || !email || !evento || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // Enviar correo usando Resend
        const { data, error } = await resend.emails.send({
            from: 'TuCatering <onboarding@resend.dev>', // Remitente de prueba
            to: ['guilleriveraa12@gmail.com'], // <--- PON TU EMAIL DE RESEND
            subject: `Nuevo contacto - ${evento}`,
            reply_to: email,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        h2 { color: #c0a070; }
                        .field { margin-bottom: 10px; }
                        .label { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h2>📋 Nuevo mensaje desde el formulario</h2>
                    <div class="field"><span class="label">Nombre:</span> ${nombre}</div>
                    <div class="field"><span class="label">Email:</span> ${email}</div>
                    <div class="field"><span class="label">Teléfono:</span> ${telefono || 'No especificado'}</div>
                    <div class="field"><span class="label">Evento:</span> ${evento}</div>
                    <div class="field"><span class="label">Fecha:</span> ${fecha || 'No especificada'}</div>
                    <div class="field"><span class="label">Invitados:</span> ${invitados || 'No especificado'}</div>
                    <div class="field"><span class="label">Mensaje:</span></div>
                    <p>${mensaje.replace(/\n/g, '<br>')}</p>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Error Resend:', error);
            return res.status(500).json({ error: 'Error al enviar el mensaje' });
        }

        // Enviar confirmación al cliente
        await resend.emails.send({
            from: 'TuCatering <onboarding@resend.dev>',
            to: [email],
            subject: 'Hemos recibido tu mensaje',
            html: `
                <h2>¡Gracias por contactarnos, ${nombre}!</h2>
                <p>Hemos recibido tu consulta sobre <strong>${evento}</strong> y te responderemos en menos de 24 horas.</p>
                <p>Saludos,<br>TuNombreCatering</p>
            `
        });

        res.json({ success: true, message: 'Mensaje enviado correctamente' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📧 Resend listo para enviar correos de prueba`);
});