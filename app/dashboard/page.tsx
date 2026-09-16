'use client'
import { useState, useEffect } from 'react'
import { Search, Clock, FileText, Settings, Activity, User, Printer, X, Mail, CheckCircle, Save, Zap, CreditCard, ShieldAlert } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
const supabase = createClient(supabaseUrl, supabaseKey)

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
  }
]

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('prescricao')
  const [dbMedicines, setDbMedicines] = useState<any[]>([])
  
  // Novos Estados: Paciente e Data
  const [patientName, setPatientName] = useState('')
  const [prescriptionDate, setPrescriptionDate] = useState('')

  const [subscriptionStatus, setSubscriptionStatus] = useState('trial')
  const [timeLeftText, setTimeLeftText] = useState('Carregando...')
  const [isExpired, setIsExpired] = useState(false)
  
  // Estados do Carimbo
  const [docName, setDocName] = useState('THIAGO FERREIRA DAMASCENO SILVA')
  const [docCRM, setDocCRM] = useState('1252648')
  const [docUF, setDocUF] = useState('RJ')
  const [docSpecialty, setDocSpecialty] = useState('MÉDICO CLÍNICO GERAL')
  const [isSaved, setIsSaved] = useState(false)
  
// 1. Mantém os dados do Carimbo salvos no navegador
  useEffect(() => {
    const savedName = localStorage.getItem('agildoc_name')
    const savedCRM = localStorage.getItem('agildoc_crm')
    const savedUF = localStorage.getItem('agildoc_uf')
    const savedSpecialty = localStorage.getItem('agildoc_specialty')
    
    if (savedName) setDocName(savedName)
    if (savedCRM) setDocCRM(savedCRM)
    if (savedUF) setDocUF(savedUF)
    if (savedSpecialty) setDocSpecialty(savedSpecialty)
  }, [])
  
  // 2. O NOVO bloco de Autenticação e Banco de Dados (Corrige o "Carregando...")
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          
          if (profile) {
            setSubscriptionStatus(profile.subscription_status)
            const trialEnd = new Date(profile.trial_ends_at).getTime()
            const now = new Date().getTime()
            const diffHours = Math.floor((trialEnd - now) / (1000 * 60 * 60))
            
            if (profile.subscription_status === 'active') {
              setTimeLeftText('Plano PRO Ativo')
              setIsExpired(false)
            } else if (diffHours <= 0) {
              setIsExpired(true)
              setTimeLeftText('Período de teste encerrado')
            } else {
              const dias = Math.floor(diffHours / 24)
              const horas = diffHours % 24
              setTimeLeftText(`${dias} dias e ${horas} horas restantes`)
              if (dias <= 7) setIsExpired(true)
            }
          } else {
             setTimeLeftText('Configurando perfil...')
          }
        } else {
          // Se não houver usuário logado
          setTimeLeftText('Modo de Visualização (Não Autenticado)')
        }

        const { data: meds } = await supabase.from('medicines').select('*')
        if (meds) {
          setDbMedicines(meds.map((d: any) => ({
            id: d.id, n: d.name, v: d.route, f: d.frequencies, t: d.category
          })))
        }
      } catch (error) {
        console.error("Erro ao verificar acesso:", error)
        setTimeLeftText('Erro ao carregar status')
      }
    }

    if (supabaseUrl !== 'https://placeholder.supabase.co') {
      loadUserData()
    } else {
      setTimeLeftText('3 dias restantes (Modo Teste)')
    }
  }, [])

  const handleSaveProfile = () => {
    localStorage.setItem('agildoc_name', docName)
    localStorage.setItem('agildoc_crm', docCRM)
    localStorage.setItem('agildoc_uf', docUF)
    localStorage.setItem('agildoc_specialty', docSpecialty)
    
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const ALL_MEDICINES = [...MEDICINES_DB, ...dbMedicines]

  const addMedicine = (med: any, freq: string) => {
    setPrescriptions([...prescriptions, { id: Date.now() + Math.random(), name: med.n, dose: med.v, freq: freq }])
  }

  const applyReceita = (receita: any) => {
    const newItems = receita.items.map((item: any, idx: number) => ({
      id: Date.now() + idx, name: item.name, dose: item.dose, freq: item.freq
    }))
    const atestado = {
      id: Date.now() + 999, name: 'Atestado Médico', dose: 'DOC', freq: `Concedo ${receita.dias} dias de afastamento (CID: ${receita.cid})`
    }
    setPrescriptions([...prescriptions, ...newItems, atestado])
  }

  // Função Limpar atualizada para limpar também o paciente e a data
  const handleClear = () => {
    setPrescriptions([])
    setPatientName('')
    setPrescriptionDate('')
  }

  const handlePrint = () => window.print()

  const ReceituarioVia = ({ titulo }: { titulo: string }) => (
    <div className="w-1/2 h-full flex flex-col p-8 relative">
      <div className="flex justify-between items-start mb-8 border-b-2 border-primary-blue pb-4">
        <Logo className="h-8" />
        <div className="text-right text-primary-blue">
          <p className="font-bold text-lg uppercase">{titulo}</p>
          <p className="text-sm">Uso Interno/Externo</p>
        </div>
      </div>
      
      {/* Dados do Paciente e Data Dinâmicos na Impressão */}
      <div className="flex gap-4 mb-8 text-sm text-primary-blue font-medium bg-gray-50 p-3 rounded-lg">
        <span className="flex-1">Paciente: <strong className="uppercase ml-1">{patientName || '___________________________________'}</strong></span>
        <span>Data: <strong className="ml-1">{prescriptionDate || '___/___/20__'}</strong></span>
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
      
      <div className="mt-auto pt-8 border-t border-gray-300 flex flex-col items-center justify-center text-primary-blue">
        <div className="w-64 border-b border-primary-blue mb-2"></div>
        <p className="font-bold text-lg uppercase tracking-wide">{docName}</p>
        <p className="font-medium text-sm">CRM-{docUF} {docCRM}</p>
        <p className="font-bold text-sm tracking-widest mt-1 uppercase">{docSpecialty}</p>
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

      <div className="hidden print:flex w-full h-screen bg-white text-black font-sans">
        <ReceituarioVia titulo="1ª VIA - PACIENTE" />
        <div className="w-px bg-dashed border-r-2 border-dashed border-gray-300 h-[90%] my-auto"></div>
        <ReceituarioVia titulo="2ª VIA - FARMÁCIA" />
      </div>

      <div className="print:hidden h-screen flex flex-col bg-bg-ice overflow-hidden font-sans text-primary-blue">
        
        <div className={`text-white text-xs md:text-sm py-2 px-6 flex justify-between items-center shadow-md z-50 transition-colors ${isExpired ? 'bg-red-600 animate-pulse' : 'bg-primary-blue'}`}>
          <span className="flex items-center gap-2 font-medium">
            <Clock size={16} className={isExpired ? 'text-white' : 'text-action-mint'} /> 
            {isExpired ? '⚠️ Seu período de testes ou plano expirou!' : 'Status do Acesso:'} <span className="font-bold underline">{timeLeftText}</span>
          </span>
          <button onClick={() => setActiveTab('planos')} className="bg-action-mint text-primary-blue font-bold px-4 py-1.5 rounded-full hover:bg-white transition-colors active:scale-95 shadow-sm">
            Ver Planos & Renovar
          </button>
        </div>

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
                <li onClick={() => setActiveTab('planos')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'planos' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <CreditCard size={20} className={activeTab === 'planos' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Planos e Assinatura</span>
                </li>
                <li onClick={() => setActiveTab('configuracoes')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'configuracoes' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Settings size={20} className={activeTab === 'configuracoes' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Perfil / Carimbo</span>
                </li>
              </ul>
            </nav>
          </aside>

          <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden relative">
            
            {isExpired && activeTab !== 'planos' && activeTab !== 'configuracoes' ? (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-extrabold text-primary-blue mb-2">Seu período de testes expirou</h2>
                <p className="text-gray-500 max-w-md mb-8">Para continuar emitindo prescrições rápidas e seguras nos seus plantões, escolha um plano abaixo para reativar seu acesso instantaneamente.</p>
                <button onClick={() => setActiveTab('planos')} className="bg-action-mint text-primary-blue font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl hover:bg-[#00c07d] transition-all">
                  Escolher Meu Plano Agora
                </button>
              </div>
            ) : null}

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {activeTab === 'prescricao' && 'Pronto Atendimento'}
                  {activeTab === 'receitas' && 'Protocolos e Receitas Prontas'}
                  {activeTab === 'planos' && 'Renovação e Planos de Assinatura'}
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
                
                <section className="flex-[1.2] bg-white rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
                  
                  {/* NOVOS CAMPOS: Paciente e Data no topo do visualizador da receita */}
                  <div className="p-5 border-b border-gray-100 bg-gray-50 shrink-0">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">NOME DO PACIENTE</label>
                        <input 
                          type="text" 
                          value={patientName} 
                          onChange={(e) => setPatientName(e.target.value)} 
                          placeholder="Digite o nome do paciente..." 
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-action-mint font-bold text-primary-blue"
                        />
                      </div>
                      <div className="w-full md:w-40">
                        <label className="block text-xs font-bold text-gray-500 mb-1">DATA</label>
                        <input 
                          type="text" 
                          value={prescriptionDate} 
                          onChange={(e) => setPrescriptionDate(e.target.value)} 
                          placeholder="DD/MM/AAAA" 
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-action-mint font-bold text-primary-blue md:text-center"
                        />
                      </div>
                    </div>
                  </div>

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
                  <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 shrink-0">
  <button onClick={handleClear} className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-200 font-bold transition-colors">
    Limpar
  </button>
  
  {/* Botão de E-mail restaurado para configuração futura */}
  <button className="px-5 py-2.5 rounded-xl bg-primary-blue text-white font-bold flex items-center gap-2 shadow-md hover:bg-[#111e38] transition-colors">
    <Mail size={16} /> Enviar por E-mail
  </button>
  
  {/* Botão de Imprimir limpo e elegante */}
  <button onClick={handlePrint} className="px-6 py-2.5 rounded-xl bg-action-mint text-white font-bold flex items-center gap-2 shadow-lg hover:bg-[#00c07d] transition-colors">
    <Printer size={16} /> Imprimir
  </button>
</div>
                </section>
              </div>
            )}

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
                        <button onClick={() => {applyReceita(receita); setActiveTab('prescricao')}} className="bg-primary-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-[#111e38]">
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

            {activeTab === 'planos' && (
              <div className="flex-1 bg-white rounded-3xl p-8 overflow-y-auto text-center">
                <h2 className="text-3xl font-black text-primary-blue mb-4">Escolha o seu plano de renovação</h2>
                <p className="text-gray-500 mb-10 max-w-xl mx-auto">Mantenha seu acesso contínuo aos prontuários e receitas rápidas no plantão.</p>
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                  <div className="border border-gray-200 p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-primary-blue mb-1">Plano Mensal</h3>
                      <p className="text-sm text-gray-400 mb-6">Renovação mês a mês.</p>
                      <div className="text-3xl font-black text-primary-blue mb-6">R$ 47,90 <span className="text-xs font-normal text-gray-400">/mês</span></div>
                    </div>
                    <a href="https://pay.kiwify.com.br/SEU-LINK-MENSAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl border-2 border-primary-blue font-bold text-primary-blue hover:bg-primary-blue hover:text-white transition-all">Assinar Mensal</a>
                  </div>
                  <div className="bg-primary-blue text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-action-mint text-primary-blue font-bold text-xs px-3 py-1 rounded-full">MAIS POPULAR</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">Plano Trimestral</h3>
                      <p className="text-sm text-white/60 mb-6">Economia para o seu plantão.</p>
                      <div className="text-3xl font-black text-action-mint mb-6">R$ 119,90 <span className="text-xs font-normal text-white/60">/tri</span></div>
                    </div>
                    <a href="https://pay.kiwify.com.br/SEU-LINK-TRIMESTRAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl bg-action-mint font-bold text-primary-blue hover:bg-[#00c07d] transition-all shadow-md">Assinar Trimestral</a>
                  </div>
                  <div className="border border-gray-200 p-6 rounded-3xl flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-primary-blue mb-1">Plano Anual</h3>
                      <p className="text-sm text-gray-400 mb-6">Máximo desconto (2 meses grátis).</p>
                      <div className="text-3xl font-black text-primary-blue mb-6">R$ 347,90 <span className="text-xs font-normal text-gray-400">/ano</span></div>
                    </div>
                    <a href="https://pay.kiwify.com.br/SEU-LINK-ANUAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl border-2 border-primary-blue font-bold text-primary-blue hover:bg-primary-blue hover:text-white transition-all">Assinar Anual</a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'configuracoes' && (
              <div className="flex-1 bg-white rounded-3xl p-8 max-w-2xl shadow-soft">
                 <h3 className="text-xl font-bold text-primary-blue mb-6 border-b pb-4">Dados do Carimbo (Impressão)</h3>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Nome do Médico (Sairá no rodapé da receita)</label>
                     <input type="text" value={docName} onChange={(e) => setDocName(e.target.value.toUpperCase())} className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint font-bold uppercase" />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-bold text-gray-600 mb-2">Número do CRM</label>
                       <input type="text" value={docCRM} onChange={(e) => setDocCRM(e.target.value)} className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint font-medium" placeholder="Ex: 123456" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-gray-600 mb-2">Estado (UF)</label>
                       <select value={docUF} onChange={(e) => setDocUF(e.target.value)} className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint font-medium cursor-pointer">
                         {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                           <option key={uf} value={uf}>{uf}</option>
                         ))}
                       </select>
                     </div>
                   </div>

                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Especialidade (Sairá abaixo do CRM)</label>
                     <input 
                       type="text" 
                       list="specialties" 
                       value={docSpecialty} 
                       onChange={(e) => setDocSpecialty(e.target.value.toUpperCase())} 
                       className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint font-bold uppercase" 
                       placeholder="Ex: MÉDICO CLÍNICO GERAL"
                     />
                     <datalist id="specialties">
                       <option value="MÉDICO CLÍNICO GERAL" />
                       <option value="PEDIATRA" />
                       <option value="CARDIOLOGISTA" />
                       <option value="GINECOLOGISTA E OBSTETRA" />
                       <option value="ORTOPEDISTA E TRAUMATOLOGISTA" />
                       <option value="PSIQUIATRA" />
                       <option value="DERMATOLOGISTA" />
                       <option value="ENDOCRINOLOGISTA" />
                       <option value="CIRURGIÃO GERAL" />
                     </datalist>
                     <p className="text-xs text-gray-400 mt-2">Selecione uma especialidade da lista ou digite livremente caso não encontre a sua.</p>
                   </div>

                   <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
                     <button onClick={handleSaveProfile} className="bg-action-mint text-primary-blue font-extrabold px-8 py-3 rounded-xl shadow-md hover:bg-[#00c07d] transition-colors flex items-center gap-2">
                       <Save size={20} /> Salvar Configurações
                     </button>
                     {isSaved && <span className="text-action-mint font-bold flex items-center gap-1 animate-pulse"><CheckCircle size={18} /> Salvo com sucesso!</span>}
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
