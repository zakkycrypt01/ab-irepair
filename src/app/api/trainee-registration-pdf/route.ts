
import puppeteer from 'puppeteer';
import axios from 'axios';

export async function POST(request: Request) {
  const body = await request.json();
  const { formData, passport } = body;

  // Generate HTML for PDF - Professional Modern Template
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
          
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 40px; 
            color: #1f2937;
            background: #fff;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #e5e7eb;
            padding: 40px;
            position: relative;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .company-name {
            font-size: 32px;
            font-weight: 800;
            color: #1e3a8a;
            letter-spacing: 2px;
            margin: 0;
            text-transform: uppercase;
          }
          
          .company-address {
            font-size: 14px;
            color: #6b7280;
            margin-top: 5px;
          }

          .form-title {
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 18px;
            font-weight: 800;
            text-align: center;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .passport-section {
            position: absolute;
            top: 40px;
            right: 40px;
          }

          .passport {
            width: 120px;
            height: 120px;
            border: 4px solid #e5e7eb;
            background: #f3f4f6;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: #9ca3af;
          }

          .passport img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .section {
            margin-bottom: 25px;
          }

          .section-title {
            font-size: 14px;
            font-weight: 700;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px;
          }

          .field {
            margin-bottom: 10px;
          }

          .label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .value {
            font-size: 14px;
            font-weight: 500;
            color: #111827;
            border-bottom: 1px dotted #d1d5db;
            padding-bottom: 2px;
            min-height: 20px;
          }

          .checkbox-group {
            display: flex;
            gap: 20px;
            margin-top: 5px;
          }

          .checkbox-item {
            display: flex;
            align-items: center;
            font-size: 13px;
          }

          .box {
            width: 14px;
            height: 14px;
            border: 1px solid #374151;
            margin-right: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .rules-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 12px;
            color: #4b5563;
          }

          .rules-title {
            font-weight: 700;
            color: #ef4444;
            text-align: center;
            margin-bottom: 10px;
            text-transform: uppercase;
          }

          .signatures {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }

          .sign-box {
            text-align: center;
            width: 200px;
          }

          .sign-line {
            border-bottom: 2px solid #374151;
            height: 30px;
            margin-bottom: 8px;
            font-family: 'Cursive', serif; 
            font-size: 18px;
            color: #1e40af;
          }

          .sign-label {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
          }

          .tech-strip {
             height: 4px;
             background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd);
             margin-top: 40px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="company-name">ABTECH iREPAIR</h1>
            <p class="company-address">Gk M.M Castle, Opp sch new gate Jatapi office Minna Niger State.</p>
          </div>
          
          <div class="passport-section">
             <div class="passport">
               ${passport ? `<img src="${passport}" />` : 'PASSPORT'}
             </div>
          </div>

          <div class="form-title">Apprentice Registration Form</div>

          <div class="section">
            <div class="section-title">Apprentice Personal Data</div>
            <div class="grid">
               <div class="field">
                 <div class="label">Full Name</div>
                 <div class="value">${formData.Name || ''}</div>
               </div>
               <div class="field">
                 <div class="label">Residential Address</div>
                 <div class="value">${formData.Address || ''}</div>
               </div>
            </div>
            <div class="grid" style="grid-template-columns: 1fr 1fr 1fr;">
               <div class="field">
                 <div class="label">Age</div>
                 <div class="value">${formData.Age || ''}</div>
               </div>
               <div class="field">
                 <div class="label">Gender</div>
                 <div class="value">${formData.Sex || ''}</div>
               </div>
               <div class="field">
                 <div class="label">Phone Number</div>
                 <div class="value">${formData.Phone || ''}</div>
               </div>
            </div>
            <div class="grid">
               <div class="field">
                 <div class="label">State of Origin</div>
                 <div class="value">${formData.State || ''}</div>
               </div>
               <div class="field">
                 <div class="label">Nationality</div>
                 <div class="value">${formData.Nationality || ''}</div>
               </div>
            </div>
             <div class="field">
                 <div class="label">Training Duration</div>
                 <div class="value">${formData.Duration || ''}</div>
             </div>
          </div>

          <div class="section">
            <div class="section-title">Guarantor Information</div>
            <div class="grid">
               <div class="field">
                 <div class="label">Guarantor Name</div>
                 <div class="value">${formData.GuarantorName || ''}</div>
               </div>
                <div class="field">
                 <div class="label">Guarantor Phone</div>
                 <div class="value">${formData.GuarantorPhone || ''}</div>
               </div>
            </div>
            <div class="field">
                 <div class="label">Guarantor Address</div>
                 <div class="value">${formData.GuarantorAddress || ''}</div>
            </div>
          </div>

          <div class="section">
             <div class="section-title">Training Schedule</div>
            <div class="checkbox-group">
                <div class="checkbox-item">
                    <div class="box">${formData.Morning ? '✓' : ''}</div> Morning (9-12)
                </div>
                <div class="checkbox-item">
                    <div class="box">${formData.Afternoon ? '✓' : ''}</div> Afternoon (12-3)
                </div>
                <div class="checkbox-item">
                     <div class="box">${formData.Evening ? '✓' : ''}</div> Evening (3-6)
                </div>
            </div>
          </div>

          <div class="rules-box">
             <div class="rules-title">Rules & Regulations Declaration</div>
             <ol>
               <li>I shall not steal or damage properties and work equipment belonging to the establishment or teacher.</li>
               <li>I shall respect and obey my Teacher at all times.</li>
               <li>I shall conduct myself professionally and avoid fighting or abusive language towards anyone.</li>
             </ol>
          </div>

          <div class="signatures">
             <div class="sign-box">
                <div class="sign-line">${formData.GuarantorSign || ''}</div>
                <div class="sign-label">Guarantor's Signature & Date</div>
             </div>
             <div class="sign-box">
                <div class="sign-line">${formData.ApprenticeSign || ''}</div>
                <div class="sign-label">Apprentice's Signature & Date</div>
             </div>
          </div>
          
           <div class="signatures" style="justify-content: center; margin-top: 20px;">
             <div class="sign-box">
                <div class="sign-line">${formData.MasterSign || ''}</div>
                <div class="sign-label">Master's Signature & Date</div>
             </div>
          </div>

          <div class="tech-strip"></div>
        </div>
      </body>
    </html>
  `;

  // Generate PDF using Puppeteer
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    await browser.close();

    // Send PDF to Telegram Bot (Optional / Legacy)
    try {
      await axios.post('http://localhost:5000/api/send-pdf', {
        pdf: Buffer.from(pdfBuffer).toString('base64'),
        fileName: 'trainee_registration.pdf',
      });
    } catch (err) {
      // Ignore telegram error
    }

    // Return PDF for download
    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=trainee_registration.pdf',
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
