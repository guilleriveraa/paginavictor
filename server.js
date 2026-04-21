const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

// ========== CARGAR VARIABLES DE ENTORNO ==========
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// ========== CONFIGURACIÓN RESEND (desde .env) ==========
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

// ⚠️ CAMBIA ESTO POR TU EMAIL VERIFICADO EN RESEND ⚠️
const TU_EMAIL = 'guilleriveraa12@gmail.com'; // Cambia por tu email real

// Verificar que la API Key está configurada
if (!RESEND_API_KEY) {
    console.error('❌ ERROR: No se encontró RESEND_API_KEY en el archivo .env');
    process.exit(1);
}

console.log('✅ API Key de Resend cargada correctamente');

// Endpoint para enviar correo
app.post('/api/enviar-contacto', async (req, res) => {
    const {
        nombre,
        email,
        telefono,
        motivo,
        evento,
        fecha,
        invitados,
        espacioInteres,
        mensaje
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !email || !motivo || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Mapear motivo a texto legible
    const motivoTexto = {
        'reserva': '📅 Reserva / Presupuesto',
        'consulta': '❓ Consulta general',
        'menu': '🍽️ Pregunta sobre menús',
        'espacio': '🏛️ Consulta sobre espacios'
    }[motivo] || motivo;

    // Mapear evento a texto legible
    const eventoTipo = {
        'boda': 'Boda',
        'corporativo': 'Evento corporativo',
        'privado': 'Fiesta privada / Cumpleaños',
        'comunion': 'Comunión / Bautizo',
        'otro': 'Otro'
    }[evento] || evento || 'No especificado';

    // Mapear espacio a texto legible
    const espacioTexto = {
        'finca-optimist': 'Finca Optimist',
        'finca-najaraya': 'Finca Najaraya',
        'sala-invernadero': 'Sala 18 · Invernadero',
        'otro': 'Otro / No lo sé'
    }[espacioInteres] || espacioInteres || 'No especificado';

    try {
        // Enviar correo al dueño del catering
        await resend.emails.send({
            from: 'TuCatering <onboarding@resend.dev>',
            to: [TU_EMAIL],
            subject: `📋 Nuevo contacto - ${motivoTexto}`,
            reply_to: email,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        h2 { color: #c0a070; border-bottom: 2px solid #c0a070; padding-bottom: 10px; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #555; width: 180px; display: inline-block; }
                        .value { color: #333; }
                        .mensaje { background: #f5f5f5; padding: 15px; margin-top: 10px; border-left: 3px solid #c0a070; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>📋 Nuevo mensaje desde la web</h2>
                        
                        <div class="field">
                            <span class="label">👤 Nombre:</span>
                            <span class="value">${nombre}</span>
                        </div>
                        
                        <div class="field">
                            <span class="label">📧 Email:</span>
                            <span class="value">${email}</span>
                        </div>
                        
                        <div class="field">
                            <span class="label">📞 Teléfono:</span>
                            <span class="value">${telefono || 'No especificado'}</span>
                        </div>
                        
                        <div class="field">
                            <span class="label">🎯 Motivo:</span>
                            <span class="value">${motivoTexto}</span>
                        </div>
                        
                        ${evento && evento !== '' ? `
                        <div class="field">
                            <span class="label">🎉 Tipo de evento:</span>
                            <span class="value">${eventoTipo}</span>
                        </div>
                        ` : ''}
                        
                        ${fecha && fecha !== '' ? `
                        <div class="field">
                            <span class="label">📅 Fecha estimada:</span>
                            <span class="value">${fecha}</span>
                        </div>
                        ` : ''}
                        
                        ${invitados && invitados !== '' ? `
                        <div class="field">
                            <span class="label">👥 Invitados:</span>
                            <span class="value">${invitados}</span>
                        </div>
                        ` : ''}
                        
                        ${espacioInteres && espacioInteres !== '' ? `
                        <div class="field">
                            <span class="label">🏛️ Espacio de interés:</span>
                            <span class="value">${espacioTexto}</span>
                        </div>
                        ` : ''}
                        
                        <div class="mensaje">
                            <strong>💬 Mensaje:</strong><br>
                            ${mensaje.replace(/\n/g, '<br>')}
                        </div>
                        
                        <div class="footer">
                            <p>Mensaje enviado desde el formulario de contacto de Catering Viró</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        // Enviar confirmación al cliente
        await resend.emails.send({
            from: 'TuCatering <onboarding@resend.dev>',
            to: [email],
            subject: '✅ Hemos recibido tu mensaje - Catering Viró',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { max-width: 500px; margin: 0 auto; padding: 20px; }
                        h2 { color: #c0a070; }
                        .highlight { color: #c0a070; font-weight: bold; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>¡Gracias por contactarnos, ${nombre}!</h2>
                        <p>Hemos recibido tu consulta con motivo: <span class="highlight">${motivoTexto}</span></p>
                        <p>Nos pondremos en contacto contigo en menos de 24 horas.</p>
                        <br>
                        <p>Saludos cordiales,<br>
                        <strong>Catering Viró</strong></p>
                        <div class="footer">
                            <p>📞 923 58 04 31 | 📧 catering@grupoviro.es</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        res.json({ success: true, message: 'Mensaje enviado correctamente' });

    } catch (error) {
        console.error('Error al enviar:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    ═══════════════════════════════════════════════
    🚀 Servidor corriendo en http://localhost:${PORT}
    📧 Resend listo para enviar correos de prueba
    ═══════════════════════════════════════════════
    `);
});