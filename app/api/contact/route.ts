import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, email, asunto, mensaje } = body;

        // Validación básica
        if (!nombre || !email || !asunto || !mensaje) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }

        // Usar Brevo (Sendinblue) para envío de emails
        const BREVO_API_KEY = process.env.BREVO_API_KEY;

        if (BREVO_API_KEY) {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    sender: {
                        name: 'Directorio Médico del Ecuador',
                        email: 'noreply@clinifymed.com'
                    },
                    to: [{
                        email: 'soporte@clinifymed.com',
                        name: 'Soporte Clinify'
                    }],
                    replyTo: {
                        email: email,
                        name: nombre
                    },
                    subject: `[Contacto] ${asunto}`,
                    htmlContent: `
                        <h2>Nuevo mensaje de contacto</h2>
                        <p><strong>Nombre:</strong> ${nombre}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Asunto:</strong> ${asunto}</p>
                        <hr>
                        <p><strong>Mensaje:</strong></p>
                        <p>${mensaje.replace(/\n/g, '<br>')}</p>
                    `,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Brevo error:', errorData);
                throw new Error('Error al enviar el email');
            }
        } else {
            // Log para desarrollo (sin API key configurada)
            console.log('📧 CONTACT FORM SUBMISSION (No email service configured)');
            console.log('From:', nombre, `<${email}>`);
            console.log('Subject:', asunto);
            console.log('Message:', mensaje);
            console.log('---');
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Contact API error:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
