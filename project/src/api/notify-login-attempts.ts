import sgMail from '@sendgrid/mail';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { email, attempts, userEmail } = await req.json();

  // Initialize SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

  const msg = {
    to: email,
    from: 'your-verified-sender@yourdomain.com', // Replace with your verified sender
    subject: 'Login Attempt Alert',
    text: `There have been ${attempts} failed login attempts for the admin panel from email: ${userEmail}. The account has been temporarily blocked for security purposes.`,
    html: `
      <h2>Login Attempt Alert</h2>
      <p>There have been <strong>${attempts}</strong> failed login attempts for the admin panel.</p>
      <p>Attempting user email: ${userEmail}</p>
      <p>The account has been temporarily blocked for security purposes.</p>
      <p>If this wasn't you, please take appropriate security measures.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
