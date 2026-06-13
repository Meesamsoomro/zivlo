import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to, subject, text, html) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: [to],
            subject: subject,
            text: text,
            html: html,
        });

        if (error) {
            console.error('Resend API error:', error);
            return false;
        }

        console.log("Email sent successfully via Resend:", data);
        return true;
    }
    catch (err) {
        console.error('Resend catch error:', err);
        return false;
    }
}
