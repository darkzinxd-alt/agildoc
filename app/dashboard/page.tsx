'use client'
import { useState, useEffect } from 'react'
import { Search, Clock, FileText, Settings, Activity, User, Printer, X, Mail, CheckCircle, Save, Zap } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { createClient } from '@supabase/supabase-js'

// Inicializa Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
const supabase = createClient(supabaseUrl, supabaseKey)

// Banco de Medicamentos Padrão (Cache Local)
const MEDICINES_DB = [
  { id: 'm1', n: 'Dipirona Sódica 1g', v: 'IV', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico' },
  { id: 'm2', n: 'Dipirona Sódica 500mg', v: 'VO', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico' },
  { id: 'm9', n: 'Ondansetrona 4mg', v: 'IV', f: ['8/8h', 'ACM', 'Dose Única'], t: 'Antiemético' },
  { id: 'm16', n: 'Ceftriaxona 1g', v: 'IV', f: ['12/12h', '24/24h'], t: 'Antibiótico' },
  { id: 'm17', n: 'Azitromicina 500mg', v: 'VO', f: ['24/24h (3 dias)', '24/24h (5 dias)'], t: 'Antibiótico' },
  { id: 'm23', n: 'Dexametasona 4mg/ml', v: 'IV', f: ['Dose Única', '8/8h'], t: 'Corticoide' },
  { id: 'm26', n: 'Prometazina 50mg', v: 'IM', f: ['Dose Única'], t: 'Antialérgico' },
  { id: 'm33', n: 'Soro Fisiológico 0.9% 500ml', v: 'IV', f: ['Correr em 1h', 'Manutenção'], t: 'Hidratação' },
]

// Receitas Prontas (Doenças Comuns)
const RECEITAS_DB = [
  {
    id: 'r1', name: 'Gastroenterite Aguda', cid: 'A09', dias: '2',
    items: [
      { name: 'Soro de Reidratação Oral', dose: 'VO', freq: 'Tomar após cada evacuação' },
      { name: 'Ondansetrona 8mg', dose: 'VO', freq: '8/8h (Em caso de náusea)' },
      { name: 'Escopolamina (Buscopan) 10mg', dose: 'VO', freq: '8/8h (Em caso de cólica)' }
    ]
  },
  {
    id: 'r2', name: 'Síndrome Gripal / IVAS', cid: 'J11', dias: '3',
    items: [
      { name: 'Dipirona Sódica 500mg', dose: 'VO', freq: '6/6h (Em caso de dor/febre)' },
      { name: 'Loratadina 10mg', dose: 'VO', freq: '24/24h (À noite)' },
      { name: 'Soro Fisiológico 0.9%', dose: 'Nasal', freq: 'Lavagem nasal 4x ao dia' }
    ]
  },
  {
    id: 'r3', name: 'Conjuntivite', cid: 'H10', dias: '3',
    items: [
      { name: 'Tobramicina (Colírio)', dose: 'Ocular', freq: '1 gota em cada olho 6/6h (7 dias)' },
      { name: 'Soro Fisiológico (Gelado)', dose: 'Local', freq: 'Compressas geladas 4x ao dia' }
    ]
  },
  {
    id: 'r4', name: 'Lombalgia Aguda', cid: 'M54', dias: '2',
    items: [
      { name: 'Diclofenaco de Sódio 50mg', dose: 'VO', freq: '8/8h (Após refeição)' },
      { name: 'Ciclobenzaprina 5mg', dose: 'VO', freq: '24/24h (Ao deitar)' },
      { name: 'Dipirona Sódica 1g', dose: 'VO', freq: '6/6h (Em caso de dor forte)' }
    ]
  },
  {
    id: 'r5', name: 'Infecção Urinária (Cistite)', cid: 'N39', dias: '2',
    items: [
      { name: 'Fosfomicina 3g (Monuril)', dose: 'VO', freq: 'Dose única (Ao deitar, bexiga vazia)' },
      { name: 'Fenazopiridina 100mg (Pyridium)', dose: 'VO', freq: '8/8h (Por 2 dias)' }
    ]
  }
]

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('prescricao')
  const [dbMedicines, setDbMedicines] = useState<any[]>([])
  
  // Perfil do Médico (Carimbo)
  const [docName, setDocName] = useState('THIAGO FERREIRA DAMASCENO SILVA')
  const [docCRM, setDocCRM] = useState('12.52648-2')
  
  useEffect(() => {
    async function fetchMedicines() {
      const { data } = await supabase.from('medicines').select('*')
      if (data) {
        setDbMedicines(data.map((d: any) => ({
          id: d.id, n: d.name, v: d.route, f: d.frequencies, t: d.category
        })))
      }
    }
    if (supabaseUrl !== 'https://placeholder.supabase.co') fetchMedicines()
  }, [])

  const ALL_MEDICINES = [...MEDICINES_DB, ...dbMedicines]

  const addMedicine = (med: any, freq: string) => {
    setPrescriptions([...prescriptions, { id: Date.now() + Math.random(), name: med.n, dose: med.v, freq: freq }])
  }

  const applyKit = (receita: any) => {
    const newItems = receita.items.map((item: any, idx: number) => ({
      id: Date.now() + idx, name: item.name, dose: item.dose, freq: item.freq
    }))
    // Adiciona o atestado na receita
    const atestado = {
      id: Date.now() + 999, name: 'Atestado Médico', dose: 'DOC', freq: `Concedo ${receita.dias} dias de afastamento (CID: ${receita.cid})`
    }
    setPrescriptions([...prescriptions, ...newItems, atestado])
  }

  const handlePrint = () => {
    window.print()
  }

  // Componente Reutilizável da Via de Impressão
  const ReceituarioVia = ({ titulo }: { titulo: string }) => (
    <div className="w-1/2 h-full flex flex-col p-8 relative">
      <div className="flex justify-between items-start mb-8 border-b-2 border-primary-blue pb-4">
        <Logo className="h-8" />
        <div className="text-right text-primary-blue">
          <p className="font-bold text-lg uppercase">{titulo}</p>
          <p className="text-sm">Uso Interno/Externo</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-8 text-sm text-primary-blue font-medium bg-gray-50 p-3 rounded-lg">
        <span>Paciente: ___________________________________</span>
        <span>Data: ___/___/20__</span>
      </div>

      <ul className="flex-1 space-y-6">
        {prescriptions.map((p, index) => (
          <li key={p.id} className="flex gap-4">
            <span className="font-black text-lg text-gray-400">{String(index + 1).padStart(2, '0')}</span>
            <div className="flex-1 border-b border-dashed border-gray-300 pb-2">
              <p className="font-bold text-primary-blue text-lg">{p.name}</p>
              <div className="flex items-center gap-2 text-gray-700 mt-1">
                <span className="font-semibold bg-gray-100 px-2 py-0.5 rounded text-sm">{p.dose}</span>
                <span>—</span>
                <span className="text-sm">{p.freq.startsWith('Aplicar') || p.freq.startsWith('Concedo') ? p.freq : 'Tomar ' + p.freq}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* CARIMBO DO MÉDICO CENTRALIZADO NO RODAPÉ */}
      <div className="mt-auto pt-8 border-t border-gray-300 flex flex-col items-center justify-center text-primary-blue">
        <div className="w-64 border-b border-primary-blue mb-2"></div>
        <p className="font-bold text-lg uppercase tracking-wide">{docName}</p>
        <p className="font-medium text-sm">CRM: {docCRM}</p>
        <p className="font-bold text-sm tracking-widest mt-1">MÉDICO</p>
      </div>
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { background: white; }
        }
      `}} />

      {/* 🟢 TELA DE IMPRESSÃO (Oculta na tela, visível no Ctrl+P) */}
      <div className="hidden print:flex w-full h-screen bg-white text-black font-sans">
        <ReceituarioVia titulo="1ª VIA - PACIENTE" />
        <div className="w-px bg-dashed border-r-2 border-dashed border-gray-300 h-[90%] my-auto"></div>
        <ReceituarioVia titulo="2ª VIA - FARMÁCIA" />
      </div>

      {/* 🟢 APLICATIVO WEB (Visível na tela, oculto no Ctrl+P) */}
      <div className="print:hidden h-screen flex flex-col bg-bg-ice overflow-hidden font-sans text-primary-blue">
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-40">
          <Logo className="h-8" />
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-blue to-[#2A416F] flex items-center justify-center text-white font-bold cursor-pointer">TF</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-soft z-30">
            <nav className="flex-1 py-6 px-3">
              <ul className="space-y-2">
                <li onClick={() => setActiveTab('prescricao')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'prescricao' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FileText size={20} className={activeTab === 'prescricao' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Nova Prescrição</span>
                </li>
                <li onClick={() => setActiveTab('receitas')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'receitas' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Zap size={20} className={activeTab === 'receitas' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Receitas Prontas</span>
                </li>
                <li onClick={() => setActiveTab('configuracoes')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'configuracoes' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Settings size={20} className={activeTab === 'configuracoes' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Perfil / Carimbo</span>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden relative">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {activeTab === 'prescricao' && 'Pronto Atendimento'}
                  {activeTab === 'receitas' && 'Protocolos e Receitas Prontas'}
                  {activeTab === 'configuracoes' && 'Configuração do Carimbo'}
                </h1>
              </div>
            </header>

            {activeTab === 'prescricao' && (
              <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                <section className="flex-1 bg-white rounded-3xl shadow-soft flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-50 sticky top-0 z-10">
                    <div className="relative group">
                      <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
                      <input type="text" placeholder="Buscar medicamento..." className="w-full bg-bg-ice border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {ALL_MEDICINES.filter(m => m.n.toLowerCase().includes(search.toLowerCase())).map(med => (
                      <div key={med.id} className="p-4 bg-white border border-gray-100 rounded-2xl">
                        <h4 className="font-bold text-primary-blue mb-2">{med.n}</h4>
                        <div className="flex flex-wrap gap-2">
                          {med.f.map((freq: string, i: number) => (
                            <button key={i} onClick={() => addMedicine(med, freq)} className="bg-action-mint/10 text-action-mint px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-action-mint hover:text-white">+ {freq}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                
                {/* Visualizador da Receita na Tela */}
                <section className="flex-[1.2] bg-white rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                     {prescriptions.length === 0 ? (
                       <div className="h-full flex flex-col items-center justify-center text-gray-300">
                          <FileText size={48} className="mb-4" /><p>Prescrição Vazia</p>
                       </div>
                     ) : (
                       <ul className="space-y-4">
                         {prescriptions.map((p, index) => (
                           <li key={p.id} className="flex gap-4 group">
                             <span className="font-black text-lg text-gray-300 pt-1">{String(index + 1).padStart(2, '0')}</span>
                             <div className="flex-1 border-b border-gray-200 pb-3 relative">
                               <input className="font-bold text-primary-blue w-full outline-none" defaultValue={p.name} />
                               <div className="flex items-center gap-2 mt-1">
                                 <input className="outline-none bg-gray-50 px-2 py-1 rounded w-16 text-sm" defaultValue={p.dose} />
                                 <input className="outline-none bg-gray-50 px-2 py-1 rounded w-full text-sm" defaultValue={p.freq} />
                               </div>
                               <button onClick={() => setPrescriptions(prescriptions.filter(x => x.id !== p.id))} className="absolute top-1 right-0 text-gray-300 hover:text-red-500"><X size={16}/></button>
                             </div>
                           </li>
                         ))}
                       </ul>
                     )}
                  </div>
                  <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={() => setPrescriptions([])} className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-200 font-bold">Limpar</button>
                    <button onClick={handlePrint} className="px-6 py-2.5 rounded-xl bg-action-mint text-white font-bold flex items-center gap-2 shadow-lg hover:bg-[#00c07d]"><Printer size={16} /> Imprimir (2 Vias)</button>
                  </div>
                </section>
              </div>
            )}

            {/* Nova Aba de Receitas Prontas */}
            {activeTab === 'receitas' && (
              <div className="flex-1 bg-white rounded-3xl p-6 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {RECEITAS_DB.map(receita => (
                    <div key={receita.id} className="border border-gray-200 rounded-2xl p-5 hover:border-action-mint transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-primary-blue">{receita.name}</h3>
                          <p className="text-sm text-gray-500">Sugestão: Atestado de {receita.dias} dias (CID {receita.cid})</p>
                        </div>
                        <button onClick={() => {applyKit(receita); setActiveTab('prescricao')}} className="bg-primary-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-[#111e38]">
                          Aplicar Receita
                        </button>
                      </div>
                      <ul className="space-y-2 bg-bg-ice p-3 rounded-lg">
                        {receita.items.map((i, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex justify-between border-b border-gray-200 pb-1 last:border-0"><span className="font-semibold">{i.name}</span> <span className="text-gray-500">{i.freq}</span></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'configuracoes' && (
              <div className="flex-1 bg-white rounded-3xl p-8 max-w-2xl">
                 <h3 className="text-xl font-bold text-primary-blue mb-6 border-b pb-4">Dados do Carimbo (Impressão)</h3>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Nome do Médico (Sairá no rodapé da receita)</label>
                     <input type="text" value={docName} onChange={(e) => setDocName(e.target.value.toUpperCase())} className="w-full bg-bg-ice border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint font-bold uppercase" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">CRM e Estado</label>
                     <input type="text" value={docCRM} onChange={(e) => setDocCRM(e.target.value)} className="w-full bg-bg-ice border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint font-medium" />
                   </div>
                 </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
