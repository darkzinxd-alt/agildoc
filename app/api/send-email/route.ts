import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { emailTarget, patientName, prescriptions, docName } = await req.json();

    // Monta o corpo do e-mail em HTML
    const listaRemedios = prescriptions.map((p: any) => 
      `<li><strong>${p.name}</strong> - ${p.dose} - ${p.freq}</li>`
    ).join('');

    const htmlContent = `
      <div style="font-family: sans-serif; color: #0B1B3D; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #00E599;">Sua Prescrição Médica - AgilDoc</h2>
        <p>Olá, <strong>${patientName || 'Paciente'}</strong>.</p>
        <p>Abaixo está a sua receita médica digital prescrita por <strong>${docName}</strong>:</p>
        <ul style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          ${listaRemedios}
        </ul>
        <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
          Este é um documento digital gerado pelo sistema AgilDoc.
        </p>
      </div>
    `;

    // Dispara o e-mail
    const data = await resend.emails.send({
      from: 'AgilDoc <onboarding@resend.dev>', // No futuro você pode usar seu domínio próprio (ex: contato@agildoc.com)
      to: [emailTarget],
      subject: `Prescrição Médica - ${patientName || 'Paciente'}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
