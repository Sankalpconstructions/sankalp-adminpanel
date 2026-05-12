import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, text, html } = body;

    if (!to || (!text && !html) || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.error('Email credentials missing');
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: user,
      to,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true, messageId: info.messageId });
  } catch (error) {
    console.error('send-email error', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
