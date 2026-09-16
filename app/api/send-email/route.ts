import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: Request) {
  try {
    // 1. VERIFICAÇÃO DE AUTENTICAÇÃO DO MÉDICO
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Acesso negado. Token ausente.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Valida o token do Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    // 2. PROCESSAMENTO DO CORPO DA REQUISIÇÃO
    const { emailTarget, patientName, prescriptions, docName } = await req.json();

    if (!emailTarget) {
      return NextResponse.json({ error: 'E-mail de destino é obrigatório.' }, { status: 400 });
    }

    // Monta o corpo do e-mail em HTML
    const listaRemedios = prescriptions.map((p: any) => 
      `<li><strong>${p.name}</strong> - ${p.dose} - ${p.freq}</li>`
    ).join('');

    const htmlContent = `
      <div style="font-family: sans-serif; color: #0B1B3D; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #00E599;">Sua Prescrição Médica - AgilDoc</h2>
        <p>Olá, <strong>${patientName || 'Paciente'}</strong>.</p>
        <p>Abaixo está a sua receita médica digital prescrita por <strong>${docName || 'Seu Médico'}</strong>:</p>
        <ul style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          ${listaRemedios}
        </ul>
        <p style="color: #64748b; font-size: 12px; margin-top: 30px;">
          Este é um documento digital gerado pelo sistema AgilDoc.
        </p>
      </div>
    `;

    // 3. DISPARO DO E-MAIL
    const data = await resend.emails.send({
      from: 'AgilDoc <onboarding@resend.dev>',
      to: [emailTarget],
      subject: `Prescrição Médica - ${patientName || 'Paciente'}`,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json({ error: 'Erro ao enviar e-mail' }, { status: 500 });
  }
}
