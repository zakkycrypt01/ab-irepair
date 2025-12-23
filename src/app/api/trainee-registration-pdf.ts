import { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formData, passport } = req.body;
  let passportUrl = passport;
  // Upload passport image to Cloudinary if present and is base64
  if (passport && passport.startsWith('data:image')) {
    try {
      const cloudinaryRes = await axios.post('https://api.cloudinary.com/v1_1/<your_cloud_name>/image/upload', {
        file: passport,
        upload_preset: '<your_upload_preset>'
      });
      passportUrl = cloudinaryRes.data.secure_url;
    } catch (err) {
      console.error('Cloudinary upload error:', err);
    }
  }

  // Generate HTML for PDF
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 2rem; }
          .header { text-align: center; font-size: 1.5rem; font-weight: bold; color: #2563eb; }
          .subheader { text-align: center; font-size: 1rem; color: #22c55e; margin-bottom: 1rem; }
          .passport { width: 100px; height: 100px; border-radius: 50%; overflow: hidden; margin: 0 auto 1rem auto; }
          .passport img { width: 100%; height: 100%; object-fit: cover; }
          .field { margin-bottom: 0.5rem; }
          .label { font-weight: bold; color: #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">ABTECH iREPAIR</div>
        <div class="subheader">Gk M.M Castle,Opp sch new gate Jatapi office Minna Niger State.</div>
        <div class="passport">${passportUrl ? `<img src='${passportUrl}' />` : ''}</div>
        <div>
          ${Object.entries(formData).map(([key, value]) => `<div class='field'><span class='label'>${key}:</span> ${value}</div>`).join('')}
        </div>
      </body>
    </html>
  `;

  // Generate PDF using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  // Send PDF to Telegram Bot
  try {
    await axios.post('http://localhost:5000/api/send-pdf', {
      pdf: Buffer.from(pdfBuffer).toString('base64'),
      fileName: 'trainee_registration.pdf',
    });
  } catch (err) {
    // Ignore error for now, just log
    console.error('Telegram send error:', err);
  }

  // Return PDF for download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=trainee_registration.pdf');
  res.send(pdfBuffer);
}
