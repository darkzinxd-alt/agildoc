'use client'
import { useState, useEffect } from 'react'
import { Search, Clock, FileText, Settings, Activity, User, Printer, X, Mail, CheckCircle, Save } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { createClient } from '@supabase/supabase-js'

// Inicializa o Supabase (Se a variável não existir na hora do build, ele não quebra)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
const supabase = createClient(supabaseUrl, supabaseKey)

// Lista Otimizada: Top Medicamentos de Plantão / Ambulatório (Cache Local Rápido)
const MEDICINES_DB = [
  { id: 'm1', n: 'Dipirona Sódica 1g', v: 'IV', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico' },
  { id: 'm2', n: 'Dipirona Sódica 500mg', v: 'VO', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico' },
  { id: 'm3', n: 'Paracetamol 750mg', v: 'VO', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico' },
  { id: 'm4', n: 'Ketorolaco (Trometamol) 30mg', v: 'IV/IM', f: ['8/8h', '12/12h', 'Dose Única'], t: 'AINE' },
  { id: 'm5', n: 'Tenoxicam 20mg', v: 'IV', f: ['12/12h', '24/24h'], t: 'AINE' },
  { id: 'm6', n: 'Ibuprofeno 600mg', v: 'VO', f: ['8/8h', '12/12h'], t: 'AINE' },
  { id: 'm7', n: 'Tramadol 50mg', v: 'IV', f: ['8/8h', 'ACM', 'Dose Única'], t: 'Opioide' },
  { id: 'm8', n: 'Morfina 10mg/ml', v: 'IV', f: ['4/4h', 'ACM (Diluída)'], t: 'Opioide' },
  { id: 'm9', n: 'Ondansetrona 4mg', v: 'IV', f: ['8/8h', 'ACM', 'Dose Única'], t: 'Antiemético' },
  { id: 'm10', n: 'Ondansetrona 8mg', v: 'VO', f: ['8/8h', '12/12h'], t: 'Antiemético' },
  { id: 'm11', n: 'Metoclopramida 10mg', v: 'IV', f: ['8/8h', 'ACM'], t: 'Antiemético' },
  { id: 'm12', n: 'Omeprazol 40mg', v: 'IV', f: ['24/24h', '12/12h'], t: 'Gástrico' },
  { id: 'm13', n: 'Pantoprazol 40mg', v: 'IV/VO', f: ['24/24h'], t: 'Gástrico' },
  { id: 'm14', n: 'Bromoprida 10mg', v: 'IV', f: ['8/8h', '12/12h'], t: 'Antiemético' },
  { id: 'm15', n: 'Simeticona 75mg/ml', v: 'VO', f: ['8/8h (40 gotas)', '6/6h'], t: 'Gástrico' },
  { id: 'm16', n: 'Ceftriaxona 1g', v: 'IV', f: ['12/12h', '24/24h'], t: 'Antibiótico' },
  { id: 'm17', n: 'Azitromicina 500mg', v: 'VO', f: ['24/24h (3 dias)', '24/24h (5 dias)'], t: 'Antibiótico' },
  { id: 'm18', n: 'Amoxicilina + Clav. 875/125mg', v: 'VO', f: ['12/12h (7 dias)', '12/12h (10 dias)'], t: 'Antibiótico' },
  { id: 'm19', n: 'Ciprofloxacino 500mg', v: 'VO', f: ['12/12h (7 dias)', '12/12h (14 dias)'], t: 'Antibiótico' },
  { id: 'm20', n: 'Levofloxacino 500mg', v: 'VO', f: ['24/24h (7 dias)'], t: 'Antibiótico' },
  { id: 'm21', n: 'Clindamicina 600mg', v: 'IV', f: ['6/6h', '8/8h'], t: 'Antibiótico' },
  { id: 'm22', n: 'Cefalexina 500mg', v: 'VO', f: ['6/6h (7 dias)'], t: 'Antibiótico' },
  { id: 'm23', n: 'Dexametasona 4mg/ml', v: 'IV', f: ['Dose Única', '8/8h'], t: 'Corticoide' },
  { id: 'm24', n: 'Hidrocortisona 500mg', v: 'IV', f: ['Ataque', '8/8h'], t: 'Corticoide' },
  { id: 'm25', n: 'Prednisona 20mg', v: 'VO', f: ['24/24h (Manhã)', '12/12h'], t: 'Corticoide' },
  { id: 'm26', n: 'Prometazina 50mg', v: 'IM', f: ['Dose Única'], t: 'Antialérgico' },
  { id: 'm27', n: 'Dexclorfeniramina 2mg', v: 'VO', f: ['8/8h', '12/12h'], t: 'Antialérgico' },
  { id: 'm28', n: 'Captopril 25mg', v: 'VO', f: ['Dose Única (Sublingual)', '8/8h'], t: 'Cardio' },
  { id: 'm29', n: 'Clonidina 0,150mg', v: 'VO', f: ['Dose Única', '12/12h'], t: 'Cardio' },
  { id: 'm30', n: 'Amiodarona 150mg', v: 'IV', f: ['Ataque (1 ampola)', 'Manutenção'], t: 'Cardio' },
  { id: 'm31', n: 'Furosemida 20mg', v: 'IV', f: ['Dose Única', '12/12h'], t: 'Diurético' },
  { id: 'm32', n: 'Losartana 50mg', v: 'VO', f: ['12/12h', '24/24h'], t: 'Cardio' },
  { id: 'm33', n: 'Soro Fisiológico 0.9% 500ml', v: 'IV', f: ['Correr em 1h', 'Manutenção'], t: 'Hidratação' },
  { id: 'm34', n: 'Soro Ringer Lactato 500ml', v: 'IV', f: ['Correr Aberto', 'Correr em 2h'], t: 'Hidratação' },
  { id: 'm35', n: 'Glicose 50% 10ml', v: 'IV', f: ['Fazer 4 ampolas (Hipoglicemia)'], t: 'Eletrólito' },
  { id: 'm36', n: 'Fenoterol 5mg/ml', v: 'Inalação', f: ['10 gotas + 5ml SF'], t: 'Broncodilatador' },
  { id: 'm37', n: 'Ipratrópio 0,25mg/ml', v: 'Inalação', f: ['20 gotas + 5ml SF'], t: 'Broncodilatador' },
  { id: 'm38', n: 'Diazepam 10mg', v: 'IV', f: ['Dose Única (Lento)'], t: 'Sedativo' },
  { id: 'm39', n: 'Midazolam 15mg/3ml', v: 'IV', f: ['Dose Única (Ataque)'], t: 'Sedativo' },
  { id: 'm40', n: 'Haloperidol 5mg', v: 'IM', f: ['Dose Única', '8/8h'], t: 'Antipsicótico' },
]

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('prescricao')
  const [emailStatus, setEmailStatus] = useState('idle')
  const [dbMedicines, setDbMedicines] = useState<any[]>([])
  const [isLoadingDB, setIsLoadingDB] = useState(false)

  // Busca no Supabase ao carregar
  useEffect(() => {
    async function fetchMedicines() {
      setIsLoadingDB(true)
      const { data, error } = await supabase.from('medicines').select('*')
      
      if (data) {
        const formattedData = data.map((d: any) => ({
          id: d.id,
          n: d.name,
          v: d.route,
          f: d.frequencies,
          t: d.category
        }))
        setDbMedicines(formattedData)
      } else if (error) {
        console.error("Erro ao buscar medicamentos do Supabase:", error.message)
      }
      setIsLoadingDB(false)
    }
    
    // Só tenta buscar se a URL não for o placeholder
    if (supabaseUrl !== 'https://placeholder.supabase.co') {
      fetchMedicines()
    }
  }, [])

  // Junção das duas listas (Código + Banco de Dados)
  const ALL_MEDICINES = [...MEDICINES_DB, ...dbMedicines]

  const addMedicine = (med: any, freq: string) => {
    const newItem = { 
      id: Date.now(),
      name: med.n, 
      dose: med.v, 
      freq: freq 
    }
    setPrescriptions([...prescriptions, newItem])
  }

  const removeMedicine = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id))
  }

  const handleSendEmail = () => {
    setEmailStatus('sending')
    setTimeout(() => {
      setEmailStatus('sent')
      setTimeout(() => setEmailStatus('idle'), 3000)
    }, 1500)
  }

  return (
    <div className="h-screen flex flex-col bg-bg-ice overflow-hidden font-sans text-primary-blue">
      {/* Header Fixo */}
      <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-40">
        <Logo className="h-8" />
        <div className="flex items-center gap-4">
          <div className="bg-action-mint/10 text-action-mint px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <Clock size={14}/> Trial: 2 dias restantes
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-blue to-[#2A416F] flex items-center justify-center text-white font-bold shadow-md cursor-pointer">
            TF
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-soft z-30">
          <nav className="flex-1 py-6 px-3">
            <ul className="space-y-2">
              <li onClick={() => setActiveTab('prescricao')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'prescricao' ? 'bg-bg-ice text-action-mint border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'}`}>
                <FileText size={20} className={activeTab === 'prescricao' ? 'text-action-mint' : ''} /> 
                <span className="hidden md:block font-bold">Nova Prescrição</span>
              </li>
              <li onClick={() => setActiveTab('historico')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'historico' ? 'bg-bg-ice text-action-mint border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'}`}>
                <Activity size={20} className={activeTab === 'historico' ? 'text-action-mint' : ''} /> 
                <span className="hidden md:block font-bold">Histórico</span>
              </li>
              <li onClick={() => setActiveTab('configuracoes')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'configuracoes' ? 'bg-bg-ice text-action-mint border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'}`}>
                <Settings size={20} className={activeTab === 'configuracoes' ? 'text-action-mint' : ''} /> 
                <span className="hidden md:block font-bold">Configurações</span>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden relative">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {activeTab === 'prescricao' && 'Pronto Atendimento'}
                {activeTab === 'historico' && 'Histórico de Prescrições'}
                {activeTab === 'configuracoes' && 'Configurações da Conta'}
              </h1>
              <p className="text-sm text-gray-500">
                {activeTab === 'prescricao' && 'Busque e clique na posologia desejada.'}
                {activeTab === 'historico' && 'Consulte as condutas emitidas recentemente.'}
                {activeTab === 'configuracoes' && 'Gerencie seus dados e sua assinatura.'}
              </p>
            </div>
            {activeTab === 'prescricao' && (
              <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm md:w-[400px]">
                 <div className="bg-gray-100 p-2 rounded-xl"><User size={18} className="text-gray-500"/></div>
                 <input type="text" placeholder="Nome do Paciente..." className="bg-transparent border-none text-sm px-3 w-full outline-none font-medium text-primary-blue placeholder-gray-400" />
              </div>
            )}
          </header>

          {activeTab === 'prescricao' && (
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
              <section className="flex-1 bg-white rounded-3xl shadow-soft border border-gray-100 flex flex-col overflow-hidden relative">
                <div className="p-4 border-b border-gray-50 bg-white sticky top-0 z-10">
                  <div className="relative group">
                    <Search size={20} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-action-mint" />
                    <input 
                      type="text" 
                      placeholder="Ex: Dipirona, Soro, Ceftriaxona..." 
                      className="w-full bg-bg-ice border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-action-mint/50 focus:border-action-mint font-medium text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {isLoadingDB && search === '' && (
                     <div className="p-4 text-center text-sm text-gray-400">Carregando banco de dados complementar...</div>
                  )}
                  {ALL_MEDICINES.filter(m => m.n.toLowerCase().includes(search.toLowerCase()) || m.t.toLowerCase().includes(search.toLowerCase())).map(med => (
                    <div key={med.id} className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-300 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                         <h4 className="font-bold text-primary-blue">{med.n}</h4>
                         <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{med.t}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {med.f.map((freq: string, i: number) => (
                           <button 
                             key={i}
                             onClick={() => addMedicine(med, freq)} 
                             className="flex items-center gap-1 bg-action-mint/10 text-action-mint hover:bg-action-mint hover:text-white border border-action-mint/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                           >
                             + {freq}
                           </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex-[1.2] bg-[#FDFDFD] rounded-3xl shadow-xl border border-gray-200 flex flex-col relative overflow-hidden">
                <div className="bg-primary-blue text-white p-6 pb-8 rounded-b-[40px] shadow-sm shrink-0 flex justify-between items-start">
                    <Logo className="h-8 brightness-0 invert" />
                    <div className="text-right">
                       <p className="text-sm font-bold opacity-90">Receituário</p>
                       <p className="text-xs text-action-mint font-medium mt-1">Via: {prescriptions.some(p => p.dose.includes('IV') || p.dose.includes('IM')) ? 'Parenteral' : 'Oral'}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
                   {prescriptions.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-gray-300">
                        <FileText size={48} strokeWidth={1} className="mb-4" />
                        <p className="font-medium text-gray-400">Prescrição Vazia</p>
                     </div>
                   ) : (
                     <ul className="space-y-4">
                       {prescriptions.map((p, index) => (
                         <li key={p.id} className="flex gap-4 group">
                           <span className="font-black text-lg text-gray-300 pt-1">{String(index + 1).padStart(2, '0')}</span>
                           <div className="flex-1 border-b border-dashed border-gray-200 pb-3 relative">
                             <input className="font-bold text-primary-blue w-full outline-none text-[15px] bg-transparent" defaultValue={p.name} />
                             <div className="flex items-center gap-2 text-gray-600 mt-1">
                               <input className="outline-none font-medium bg-gray-50 px-2 py-1 rounded w-16 text-sm" defaultValue={p.dose} />
                               <span className="text-gray-300">—</span>
                               <input className="outline-none font-medium bg-gray-50 px-2 py-1 rounded w-full text-sm" defaultValue={'Aplicar ' + p.freq} />
                             </div>
                             <button 
                               onClick={() => removeMedicine(p.id)}
                               className="absolute top-1 right-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 bg-white rounded-full shadow-sm border border-gray-100"
                             >
                               <X size={14} />
                             </button>
                           </div>
                         </li>
                       ))}
                     </ul>
                   )}
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 border border-gray-200 rounded-2xl shadow-float flex flex-wrap md:flex-nowrap justify-end items-center gap-3">
                  <button onClick={() => setPrescriptions([])} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 text-sm w-full md:w-auto">
                    Limpar
                  </button>
                  <button 
                    onClick={handleSendEmail}
                    disabled={emailStatus !== 'idle'}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 border-2 
                      ${emailStatus === 'idle' ? 'bg-white border-primary-blue text-primary-blue hover:bg-gray-50' : 
                        emailStatus === 'sending' ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-wait' : 
                        'bg-action-mint border-action-mint text-white'}`}
                  >
                    {emailStatus === 'idle' && <><Mail size={16} /> Enviar p/ Paciente</>}
                    {emailStatus === 'sending' && 'Enviando...'}
                    {emailStatus === 'sent' && <><CheckCircle size={16} /> E-mail Enviado!</>}
                  </button>
                  <button className="w-full md:w-auto px-6 py-2.5 rounded-xl font-bold bg-action-mint text-primary-blue hover:bg-[#00e394] shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
                    <Printer size={16} /> Imprimir
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="flex-1 bg-white rounded-3xl shadow-soft border border-gray-100 p-8 flex flex-col items-center justify-center text-gray-400">
               <Activity size={48} className="mb-4 opacity-50 text-primary-blue" />
               <h3 className="text-xl font-bold text-primary-blue mb-2">Nenhum histórico encontrado</h3>
               <p className="text-center max-w-sm">Suas prescrições salvas aparecerão aqui.</p>
            </div>
          )}

          {activeTab === 'configuracoes' && (
            <div className="flex-1 bg-white rounded-3xl shadow-soft border border-gray-100 p-8 max-w-3xl">
               <h3 className="text-xl font-bold text-primary-blue mb-6 border-b border-gray-100 pb-4">Perfil Médico</h3>
               <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Nome Completo</label>
                     <input type="text" defaultValue="Dr. Thiago Ferreira" className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">CRM (UF)</label>
                     <input type="text" placeholder="CRM-RJ 00000" className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-gray-600 mb-2">E-mail de Acesso</label>
                   <input type="email" disabled defaultValue="thiago@exemplo.com" className="w-full bg-gray-100 text-gray-400 border border-gray-200 rounded-xl px-4 py-3 outline-none cursor-not-allowed" />
                 </div>
                 <div className="pt-6 border-t border-gray-100 flex justify-end">
                   <button className="px-8 py-3 rounded-xl font-bold bg-primary-blue text-white hover:bg-[#111e38] shadow-lg transition-all flex items-center gap-2">
                     <Save size={20} /> Salvar Alterações
                   </button>
                 </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
