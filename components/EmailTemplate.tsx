// components/EmailTemplate.tsx
interface EmailTemplateProps {
  patientName: string;
  docName: string;
  prescriptions: Array<{ name: string; dose: string; freq: string }>;
}

export const EmailTemplate = ({ patientName, docName, prescriptions }: EmailTemplateProps) => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#0B1B3D', maxWidth: '600px', margin: '0 auto', border: '1px solid #e2e8f0', padding: '30px', borderRadius: '16px', background: '#ffffff' }}>
      
      {/* Cabeçalho Padrão com a Marca */}
      <div style={{ borderBottom: '2px solid #0B1B3D', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#0B1B3D', fontSize: '22px', margin: 0, fontWeight: 900, letterSpacing: '1px' }}>AGILDOC</h1>
        <span style={{ color: '#00E599', fontWeight: 'bold', fontSize: '12px', background: '#0B1B3D', padding: '4px 10px', borderRadius: '6px' }}>PRESCRIÇÃO DIGITAL</span>
      </div>

      <p style={{ fontSize: '16px', color: '#334155' }}>Olá, <strong>{patientName || 'Paciente'}</strong>.</p>
      <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.5' }}>
        Abaixo estão as orientações e os medicamentos prescritos durante o seu atendimento com <strong>{docName}</strong>:
      </p>

      {/* Lista de Medicamentos */}
      <ul style={{ background: '#f8fafc', padding: '20px 20px 20px 40px', borderRadius: '12px', margin: '20px 0', border: '1px solid #f1f5f9' }}>
        {prescriptions.map((p, idx) => (
          <li key={idx} style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#0B1B3D', fontSize: '16px' }}>{p.name}</strong><br />
            <span style={{ fontSize: '14px', color: '#64748b' }}>{p.dose} — {p.freq}</span>
          </li>
        ))}
      </ul>

      {/* Rodapé Padrão */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
          Documento gerado com segurança através da plataforma <strong>AgilDoc</strong>.
        </p>
      </div>
    </div>
  );
};
