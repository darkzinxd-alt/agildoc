'use client'
import { useState } from 'react'
import { Search, Clock, CheckCircle, FileText, Settings, CreditCard, Plus, AlertTriangle, Activity, User, Printer, X, Save } from 'lucide-react'
import { Logo } from '../../components/Logo'

// 🟢 LISTA DE REMÉDIOS: Para adicionar novos, basta copiar uma linha, colar embaixo, mudar o ID e os dados.
const MOCK_MEDICINES = [
  { id: 1, name: 'Dipirona Sódica', dose: '1g IV', freq: '6/6h', alert: false, tag: 'Analgésico' },
  { id: 2, name: 'Ceftriaxona', dose: '1g IV', freq: '12/12h', alert: true, tag: 'Antibiótico' },
  { id: 3, name: 'Ondansetrona', dose: '4mg IV', freq: '8/8h', alert: false, tag: 'Antiemético' },
  { id: 4, name: 'Soro Fisiológico 0.9%', dose: '500ml IV', freq: 'Correr em 1h', alert: false, tag: 'Hidratação' },
  { id: 5, name: 'Adrenalina', dose: '1mg', freq: 'ACM', alert: true, tag: 'Emergência' }, // Adicionado como exemplo
  { id: 6, name: 'Morfina', dose: '2 a 10mg IV', freq: '4/4h', alert: true, tag: 'Opioide' }, // Adicionado como exemplo
]

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('prescricao') // 'prescricao', 'historico', ou 'configuracoes'

  const addMedicine = (med: any) => {
    if (!prescriptions.find(p => p.id === med.id)) {
      setPrescriptions([...prescriptions, med])
    }
  }

  const removeMedicine = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id))
  }

  return (
    <div className="h-screen flex flex-col bg-bg-ice overflow-hidden font-sans text-primary-blue">
      {/* Premium Trial Banner */}
      <div className="bg-primary-blue text-white text-xs md:text-sm py-2 px-6 flex justify-center md:justify-between items-center shadow-md z-50">
        <span className="flex items-center gap-2 font-medium">
          <Clock size={16} className="text-action-mint animate-pulse"/> 
          Seu acesso gratuito expira em <span className="font-bold text-action-mint">2 dias e 14 horas</span>
        </span>
        <button className="hidden md:block bg-action-mint text-primary-blue font-bold px-4 py-1.5 rounded-full hover:bg-white transition-colors active:scale-95">
          Ativar Plano Pro
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Modern Floating Sidebar */}
        <aside className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-soft z-40">
          <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-gray-50">
            <Logo className="h-8 md:h-10 hidden md:flex" />
            <div className="md:hidden w-10 h-10 bg-primary-blue rounded-xl flex items-center justify-center">
               <span className="text-action-mint font-bold text-xl">+</span>
            </div>
          </div>
          
          <nav className="flex-1 py-6 px-3">
            <ul className="space-y-2">
              <li 
                onClick={() => setActiveTab('prescricao')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'prescricao' ? 'bg-bg-ice text-action-mint border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'}`}
              >
                <FileText size={20} className={activeTab === 'prescricao' ? 'text-action-mint' : ''} /> 
                <span className="hidden md:block font-bold">Nova Prescrição</span>
              </li>
              <li 
                onClick={() => setActiveTab('historico')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'historico' ? 'bg-bg-ice text-action-mint border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'}`}
              >
                <Activity size={20} className={activeTab === 'historico' ? 'text-action-mint' : ''} /> 
                <span className="hidden md:block font-bold">Histórico</span>
              </li>
              <li 
                onClick={() => setActiveTab('configuracoes')}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeTab === 'configuracoes' ? 'bg-bg-ice text-action-mint border border-gray-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-primary-blue'}`}
              >
                <Settings size={20} className={activeTab === 'configuracoes' ? 'text-action-mint' : ''} /> 
                <span className="hidden md:block font-bold">Configurações</span>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 border-t border-gray-50">
             <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-blue to-[#2A416F] flex items-center justify-center text-white font-bold shadow-md">
                  TF
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold leading-tight">Dr. Thiago</p>
                  <p className="text-xs text-action-mint font-semibold">TRIAL</p>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-4 md:p-6 gap-6 overflow-hidden relative">
          
          {/* Header Dashboard */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {activeTab === 'prescricao' && 'Pronto Atendimento'}
                {activeTab === 'historico' && 'Histórico de Prescrições'}
                {activeTab === 'configuracoes' && 'Configurações da Conta'}
              </h1>
              <p className="text-sm text-gray-500">
                {activeTab === 'prescricao' && 'Selecione o paciente e monte a conduta.'}
                {activeTab === 'historico' && 'Consulte as condutas emitidas recentemente.'}
                {activeTab === 'configuracoes' && 'Gerencie seus dados e sua assinatura.'}
              </p>
            </div>
            
            {activeTab === 'prescricao' && (
              <div className="flex items-center bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm md:w-[400px]">
                 <div className="bg-gray-100 p-2 rounded-xl"><User size={18} className="text-gray-500"/></div>
                 <input type="text" placeholder="Buscar prontuário ou nome..." className="bg-transparent border-none text-sm px-3 w-full outline-none font-medium text-primary-blue placeholder-gray-400" />
              </div>
            )}
          </header>

          {/* ---------------- ABA 1: NOVA PRESCRIÇÃO ---------------- */}
          {activeTab === 'prescricao' && (
            <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
              <section className="flex-1 bg-white rounded-3xl shadow-soft border border-gray-100 flex flex-col overflow-hidden relative">
                <div className="p-5 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="relative group">
                    <Search size={20} className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-action-mint transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Buscar medicação, soro, kit emergência..." 
                      className="w-full bg-bg-ice border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-action-mint/50 focus:border-action-mint transition-all font-medium text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {MOCK_MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase())).map(med => (
                    <div key={med.id} className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-action-mint/50 hover:shadow-md transition-all duration-300">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h4 className="font-bold text-primary-blue">{med.name}</h4>
                           <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{med.tag}</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{med.dose} • {med.freq}</p>
                        {med.alert && (
                          <p className="text-xs text-red-500 flex items-center mt-2 font-semibold bg-red-50 inline-flex px-2 py-1 rounded-md">
                            <AlertTriangle size={14} className="mr-1"/> Risco de interação
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={() => addMedicine(med)} 
                        className="w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 flex items-center justify-center gap-2 rounded-xl font-bold text-action-mint border-2 border-action-mint/20 hover:bg-action-mint hover:text-white hover:border-action-mint transition-all active:scale-95"
                      >
                        <Plus size={18} /> <span className="hidden md:inline">Adicionar</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex-[1.2] bg-[#FDFDFD] rounded-3xl shadow-xl border border-gray-200 flex flex-col relative overflow-hidden">
                <div className="bg-primary-blue text-white p-6 pb-8 rounded-b-[40px] shadow-sm shrink-0">
                   <div className="flex justify-between items-start mb-4">
                      <Logo className="h-8 brightness-0 invert" />
                      <div className="text-right">
                         <p className="text-sm font-bold opacity-90">Receituário Hospitalar</p>
                         <p className="text-xs text-action-mint font-medium mt-1">Uso Interno</p>
                      </div>
                   </div>
                   <div className="flex gap-4 mt-6">
                      <span className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium">João da Silva</span>
                      <span className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium">32 Anos</span>
                      <span className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-medium">78kg</span>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                   {prescriptions.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-gray-300">
                        <FileText size={64} strokeWidth={1} className="mb-4" />
                        <p className="font-medium text-lg text-gray-400">Prescrição Vazia</p>
                        <p className="text-sm text-gray-400 mt-2 text-center max-w-[200px]">Busque e adicione medicações na barra ao lado.</p>
                     </div>
                   ) : (
                     <ul className="space-y-6">
                       {prescriptions.map((p, index) => (
                         <li key={p.id} className="flex gap-4 group">
                           <span className="font-black text-xl text-gray-300 pt-1">{String(index + 1).padStart(2, '0')}</span>
                           <div className="flex-1 border-b border-dashed border-gray-200 pb-4 relative">
                             <input 
                               className="font-bold text-primary-blue w-full outline-none text-lg bg-transparent focus:bg-gray-50 rounded px-1 transition-colors" 
                               defaultValue={p.name} 
                             />
                             <div className="flex flex-col md:flex-row gap-1 md:gap-2 text-gray-600 mt-2 px-1">
                               <input className="outline-none font-medium bg-gray-50 px-2 py-1 rounded focus:ring-2 focus:ring-action-mint/50 w-full md:w-32" defaultValue={p.dose} />
                               <span className="hidden md:inline text-gray-300 py-1">—</span>
                               <input className="outline-none font-medium bg-gray-50 px-2 py-1 rounded focus:ring-2 focus:ring-action-mint/50 w-full" defaultValue={'Aplicar ' + p.freq} />
                             </div>
                             <button 
                               onClick={() => removeMedicine(p.id)}
                               className="absolute top-1 right-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 bg-white rounded-full shadow-sm border border-gray-100"
                             >
                               <X size={16} />
                             </button>
                           </div>
                         </li>
                       ))}
                     </ul>
                   )}
                </div>

                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-4 border border-gray-200 rounded-2xl shadow-float flex flex-col md:flex-row justify-between items-center gap-4">
                  <button 
                    onClick={() => setPrescriptions([])}
                    className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    Limpar tudo
                  </button>
                  <button className="w-full md:w-auto px-8 py-3 rounded-xl font-bold bg-action-mint text-primary-blue hover:bg-[#00e394] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <Printer size={20} /> Assinar e Imprimir
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ---------------- ABA 2: HISTÓRICO ---------------- */}
          {activeTab === 'historico' && (
            <div className="flex-1 bg-white rounded-3xl shadow-soft border border-gray-100 p-8 flex flex-col items-center justify-center text-gray-400">
               <Activity size={48} className="mb-4 opacity-50 text-primary-blue" />
               <h3 className="text-xl font-bold text-primary-blue mb-2">Nenhum histórico encontrado</h3>
               <p className="text-center max-w-sm">Quando o banco de dados for conectado, as prescrições salvas aparecerão aqui automaticamente.</p>
            </div>
          )}

          {/* ---------------- ABA 3: CONFIGURAÇÕES ---------------- */}
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
