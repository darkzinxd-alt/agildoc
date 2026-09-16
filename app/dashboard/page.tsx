'use client'
import { useState, useEffect } from 'react'
import { Search, Clock, FileText, Settings, Zap, Printer, X, Mail, CheckCircle, Save, CreditCard, ShieldAlert, Star, Bookmark, Trash2, LogOut, Camera, User, Stethoscope, Sparkles, Lock, Building2, AlertTriangle } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

const MEDICINES_DB = [
  { id: 'm1', n: 'Dipirona Sódica 1g', v: 'IV', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico', specialty: 'geral', tarja: 'branca' },
  { id: 'm2', n: 'Dipirona Sódica 500mg', v: 'VO', f: ['6/6h', '8/8h', 'ACM'], t: 'Analgésico', specialty: 'geral', tarja: 'branca' },
  { id: 'm9', n: 'Ondansetrona 4mg', v: 'IV', f: ['8/8h', 'ACM', 'Dose Única'], t: 'Antiemético', specialty: 'geral', tarja: 'vermelha' },
  { id: 'm16', n: 'Ceftriaxona 1g', v: 'IV', f: ['12/12h', '24/24h'], t: 'Antibiótico', specialty: 'pediatria', tarja: 'vermelha' },
  { id: 'm17', n: 'Azitromicina 500mg', v: 'VO', f: ['24/24h (3 dias)', '24/24h (5 dias)'], t: 'Antibiótico', specialty: 'pediatria', tarja: 'vermelha' },
  { id: 'm23', n: 'Dexametasona 4mg/ml', v: 'IV', f: ['Dose Única', '8/8h'], t: 'Corticoide', specialty: 'ortopedia', tarja: 'vermelha' },
  { id: 'm26', n: 'Prometazina 50mg', v: 'IM', f: ['Dose Única'], t: 'Antialérgico', specialty: 'geral', tarja: 'vermelha' },
  { id: 'm33', n: 'Soro Fisiológico 0.9% 500ml', v: 'IV', f: ['Correr em 1h', 'Manutenção'], t: 'Hidratação', specialty: 'geral', tarja: 'branca' },
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
  }
]

const KNOWN_INTERACTIONS = [
  { drugA: 'Diclofenaco', drugB: 'Aspirina', msg: 'Risco aumentado de sangramento gastrintestinal e toxicidade renal.' },
  { drugA: 'Ceftriaxona', drugB: 'Soro Fisiológico com Cálcio', msg: 'Risco de precipitação fatal de sais de cálcio.' },
  { drugA: 'Fluoxetina', drugB: 'Tramadol', msg: 'Risco severo de Síndrome Serotoninérgica.' }
]

const PHQ9_QUESTIONS = [
  'Pouco interesse ou prazer em fazer as coisas',
  'Sentir-se para baixo, deprimido(a) ou sem esperança',
  'Dificuldade para pegar no sono, continuar dormindo ou dormir demais',
  'Sentir-se cansado(a) ou com pouca energia',
  'Falta de apetite ou comer demais',
  'Sentir-se mal consigo mesmo(a) — ou sentir que é um fracasso ou que decepcionou a si mesmo(a) ou a família',
  'Dificuldade para se concentrar em tarefas, como ler ou assistir TV',
  'Lentidão para se mover ou falar (perceptível a outras pessoas) — ou o oposto, estar tão agitado(a) que se movimenta muito mais que o habitual',
  'Pensamentos de que seria melhor estar morto(a) ou de se machucar de alguma forma'
]

const GAD7_QUESTIONS = [
  'Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',
  'Não conseguir parar ou controlar as preocupações',
  'Preocupar-se demais com diversas coisas',
  'Dificuldade para relaxar',
  'Ficar tão agitado(a) que é difícil permanecer parado(a)',
  'Ficar facilmente irritado(a) ou impaciente',
  'Sentir medo, como se algo terrível fosse acontecer'
]

const SCALE_OPTIONS = [
  { value: 0, label: 'Nunca' },
  { value: 1, label: 'Vários dias' },
  { value: 2, label: 'Mais da metade dos dias' },
  { value: 3, label: 'Quase todos os dias' }
]

function getPHQ9Severity(score: number) {
  if (score <= 4) return { label: 'Mínimo', color: 'bg-green-100 text-green-700' }
  if (score <= 9) return { label: 'Leve', color: 'bg-yellow-100 text-yellow-700' }
  if (score <= 14) return { label: 'Moderado', color: 'bg-orange-100 text-orange-700' }
  if (score <= 19) return { label: 'Moderadamente Severo', color: 'bg-red-100 text-red-700' }
  return { label: 'Severo', color: 'bg-red-200 text-red-800' }
}

function getGAD7Severity(score: number) {
  if (score <= 4) return { label: 'Mínimo', color: 'bg-green-100 text-green-700' }
  if (score <= 9) return { label: 'Leve', color: 'bg-yellow-100 text-yellow-700' }
  if (score <= 14) return { label: 'Moderado', color: 'bg-orange-100 text-orange-700' }
  return { label: 'Severo', color: 'bg-red-200 text-red-800' }
}

export default function Dashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('prescricao')
  const [dbMedicines, setDbMedicines] = useState<any[]>([])
  
  // Identificação Universal do Paciente e Alergias Editáveis
  const [patientName, setPatientName] = useState('')
  const [prescriptionDate, setPrescriptionDate] = useState('')
  const [patientAllergiesInput, setPatientAllergiesInput] = useState('') // Input digitado pelo médico
  
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('todas')
  const [selectedClassFilter, setSelectedClassFilter] = useState('todas')
  const [selectedTarjaFilter, setSelectedTarjaFilter] = useState('todas')
  const [drugInteractionsAlerts, setDrugInteractionsAlerts] = useState<string[]>([])
  
  // Especialistas e Histórico de Dor (Ortopedia)
  const [activeSpecialtyTool, setActiveSpecialtyTool] = useState('ortopedia')
  const [painLevel, setPainLevel] = useState<number | null>(null)
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('')
  const [bodySide, setBodySide] = useState<'frente' | 'costas'>('frente')
  const [painHistory, setPainHistory] = useState<any[]>([])

  // Escalas clínicas (PHQ-9 / GAD-7)
  const [phq9Answers, setPhq9Answers] = useState<(number | null)[]>(Array(9).fill(null))
  const [gad7Answers, setGad7Answers] = useState<(number | null)[]>(Array(7).fill(null))

  // Estado para laudo gerado por IA
  const [generatedReport, setGeneratedReport] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const [subscriptionStatus, setSubscriptionStatus] = useState('trial')
  const [userPlanTier, setUserPlanTier] = useState('basico') // 'basico' ou 'pro'
  const [timeLeftText, setTimeLeftText] = useState('Carregando...')
  const [isExpired, setIsExpired] = useState(false)
  
  const [docName, setDocName] = useState('')
  const [docCRM, setDocCRM] = useState('')
  const [docUF, setDocUF] = useState('RJ')
  const [docSpecialty, setDocSpecialty] = useState('')
  const [docAvatar, setDocAvatar] = useState('')
  const [docHospital, setDocHospital] = useState('') // Unidade de Atendimento / Hospital
  const [userEmail, setUserEmail] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [patientEmail, setPatientEmail] = useState('')
  const [isSending, setIsSending] = useState(false)

  const [favoriteProtocols, setFavoriteProtocols] = useState<any[]>([])
  const [showSaveFavoriteModal, setShowSaveFavoriteModal] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')
  const [isSavingFavorite, setIsSavingFavorite] = useState(false)

  const phq9AllAnswered = phq9Answers.every(a => a !== null)
  const phq9Score = phq9Answers.reduce((sum: number, v) => sum + (v ?? 0), 0)
  const phq9SelfHarmFlag = (phq9Answers[8] ?? 0) > 0
  const gad7AllAnswered = gad7Answers.every(a => a !== null)
  const gad7Score = gad7Answers.reduce((sum: number, v) => sum + (v ?? 0), 0)

  // Função centralizada para bloquear interações do plano básico nas ferramentas de especialistas
  const handleRestrictedAction = () => {
    if (userPlanTier === 'basico') {
      alert('🔒 Recurso exclusivo do Plano PRO. Faça o upgrade na aba "Planos e Assinatura" para interagir com as ferramentas de especialistas e emitir laudos com IA!')
      setActiveTab('planos')
      return true
    }
    return false
  }

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    const logoutDueToInactivity = async () => {
      await supabase.auth.signOut()
      alert('Sua sessão expirou por inatividade por motivos de segurança.')
      window.location.href = '/' 
    }
    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      inactivityTimer = setTimeout(logoutDueToInactivity, 15 * 60 * 1000) 
    }
    window.addEventListener('mousemove', resetTimer)
    window.addEventListener('keypress', resetTimer)
    window.addEventListener('click', resetTimer)
    window.addEventListener('scroll', resetTimer)
    resetTimer()
    return () => {
      clearTimeout(inactivityTimer)
      window.removeEventListener('mousemove', resetTimer)
      window.removeEventListener('keypress', resetTimer)
      window.removeEventListener('click', resetTimer)
      window.removeEventListener('scroll', resetTimer)
    }
  }, [])
  
  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserEmail(user.email || '')
          const userId = user.id
          const savedName = localStorage.getItem(`agildoc_name_${userId}`)
          const savedCRM = localStorage.getItem(`agildoc_crm_${userId}`)
          const savedUF = localStorage.getItem(`agildoc_uf_${userId}`)
          const savedSpecialty = localStorage.getItem(`agildoc_specialty_${userId}`)
          const savedAvatar = localStorage.getItem(`agildoc_avatar_${userId}`)
          const savedHospital = localStorage.getItem(`agildoc_hospital_${userId}`)
          
          if (savedName) setDocName(savedName)
          if (savedCRM) setDocCRM(savedCRM)
          if (savedUF) setDocUF(savedUF)
          if (savedSpecialty) setDocSpecialty(savedSpecialty)
          if (savedAvatar) setDocAvatar(savedAvatar)
          if (savedHospital) setDocHospital(savedHospital)

          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
          if (profile) {
            setSubscriptionStatus(profile.subscription_status)
            if (profile.plan_tier) setUserPlanTier(profile.plan_tier)
            
            const trialEnd = new Date(profile.trial_ends_at).getTime()
            const now = new Date().getTime()
            const diffHours = Math.floor((trialEnd - now) / (1000 * 60 * 60))
            if (profile.subscription_status === 'active') {
              setTimeLeftText(`Plano ${profile.plan_tier === 'pro' ? 'PRO' : 'Básico'} Ativo`)
              setIsExpired(false)
            } else if (diffHours <= 0) {
              setIsExpired(true)
              setTimeLeftText('Período de teste encerrado')
            } else {
              const dias = Math.floor(diffHours / 24)
              const horas = diffHours % 24
              setTimeLeftText(dias > 0 ? `${dias} dia(s) e ${horas}h restantes de teste` : `${horas} horas restantes de teste`)
              if (diffHours <= 0) setIsExpired(true)
            }
          } else {
             setTimeLeftText('Configurando perfil...')
          }

          const { data: favs } = await supabase.from('favorite_prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
          if (favs) setFavoriteProtocols(favs)
        } else {
          setTimeLeftText('Modo de Visualização (Não Autenticado)')
        }

        const { data: meds } = await supabase.from('medicines').select('*')
        if (meds) {
          setDbMedicines(meds.map((d: any) => ({
            id: d.id, n: d.name, v: d.route, f: d.frequencies, t: d.category, specialty: d.specialty || 'geral', tarja: d.tarja || 'branca'
          })))
        }
      } catch (error) {
        console.error("Erro ao verificar acesso:", error)
        setTimeLeftText('Erro ao carregar status')
      }
    }

    if (supabaseUrl !== 'https://placeholder.supabase.co') loadUserData()
    else setTimeLeftText('3 dias restantes (Modo Teste)')
  }, [])

  const fuzzyMatch = (text: string, query: string) => {
    if (!query) return true
    const cleanText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const cleanQuery = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return cleanText.includes(cleanQuery)
  }

  const handleAddMedicineWithChecks = (med: any, freq: string) => {
    // Quebra as alergias digitadas pelo médico por vírgula para verificar individualmente
    const activeAllergies = patientAllergiesInput
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(a => a.length > 0)

    const isAllergic = activeAllergies.some(allergy => 
      med.n.toLowerCase().includes(allergy) || 
      (med.t && med.t.toLowerCase().includes(allergy))
    )

    if (isAllergic) {
      const confirmar = confirm(`⚠️ ALERTA DE ALERGIA: O paciente possui restrição registrada a "${med.n}" ou classe similar (Alergias cadastradas: ${patientAllergiesInput}). Deseja prosseguir mesmo assim?`)
      if (!confirmar) return
    }

    const newItems = [...prescriptions, { id: Date.now() + Math.random(), name: med.n, dose: med.v, freq: freq, class: med.t }]
    setPrescriptions(newItems)
    checkInteractions(newItems)
  }

  const checkInteractions = (currentList: any[]) => {
    const alerts: string[] = []
    for (let i = 0; i < currentList.length; i++) {
      for (let j = i + 1; j < currentList.length; j++) {
        const med1 = currentList[i].name
        const med2 = currentList[j].name
        KNOWN_INTERACTIONS.forEach(inter => {
          if (
            (med1.toLowerCase().includes(inter.drugA.toLowerCase()) && med2.toLowerCase().includes(inter.drugB.toLowerCase())) ||
            (med1.toLowerCase().includes(inter.drugB.toLowerCase()) && med2.toLowerCase().includes(inter.drugA.toLowerCase()))
          ) {
            alerts.push(`Interação entre ${med1} e ${med2}: ${inter.msg}`)
          }
        })
      }
    }
    setDrugInteractionsAlerts(alerts)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 150
        const MAX_HEIGHT = 150
        let width = img.width
        let height = img.height
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        setDocAvatar(canvas.toDataURL('image/jpeg', 0.7))
      }
    }
  }

  const handleSaveProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      localStorage.setItem(`agildoc_name_${user.id}`, docName)
      localStorage.setItem(`agildoc_crm_${user.id}`, docCRM)
      localStorage.setItem(`agildoc_uf_${user.id}`, docUF)
      localStorage.setItem(`agildoc_specialty_${user.id}`, docSpecialty)
      localStorage.setItem(`agildoc_hospital_${user.id}`, docHospital)
      if (docAvatar) localStorage.setItem(`agildoc_avatar_${user.id}`, docAvatar)
    }
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/' 
  }

  const ALL_MEDICINES = [...MEDICINES_DB, ...dbMedicines]

  const applyReceita = (receita: any) => {
    const newItems = receita.items.map((item: any, idx: number) => ({
      id: Date.now() + idx, name: item.name, dose: item.dose, freq: item.freq
    }))
    if (receita.dias) {
      const atestado = { id: Date.now() + 999, name: 'Atestado Médico', dose: 'DOC', freq: `Concedo ${receita.dias} dias de afastamento (CID: ${receita.cid})` }
      setPrescriptions([...prescriptions, ...newItems, atestado])
    } else {
      setPrescriptions([...prescriptions, ...newItems])
    }
  }

  const handleClear = () => {
    setPrescriptions([])
    setPatientName('')
    setPrescriptionDate('')
    setPatientAllergiesInput('')
    setDrugInteractionsAlerts([])
    setPainLevel(null)
    setSelectedBodyPart('')
    setPainHistory([])
    setPhq9Answers(Array(9).fill(null))
    setGad7Answers(Array(7).fill(null))
    setGeneratedReport('')
  }

  const handlePrint = () => window.print()

  const handleAddPainRecord = () => {
    if (handleRestrictedAction()) return
    if (!selectedBodyPart || painLevel === null) {
      return alert('Selecione uma região anatômica no boneco e a intensidade da dor na escala EVA.')
    }
    const newItem = {
      id: Date.now(),
      part: selectedBodyPart,
      side: bodySide,
      level: painLevel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setPainHistory([newItem, ...painHistory])
    setSelectedBodyPart('')
    setPainLevel(null)
  }

  const handleGenerateAIReport = () => {
    if (handleRestrictedAction()) return

    setIsGeneratingAI(true)
    setTimeout(() => {
      let reportText = `LAUDO / RELATÓRIO CLÍNICO\nPaciente: ${patientName || 'Não informado'} | Data: ${prescriptionDate || new Date().toLocaleDateString()}\n\n`
      
      if (activeSpecialtyTool === 'ortopedia') {
        reportText += `AVALIAÇÃO ORTOPÉDICA E DE DOR (EVA):\n`
        if (painHistory.length === 0) {
          reportText += `- Nenhuma queixa álgica registrada no histórico corporal.\n`
        } else {
          painHistory.forEach((item, idx) => {
            reportText += `${idx + 1}. Região: ${item.part} (${item.side}) — Intensidade de Dor (EVA): ${item.level}/10\n`
          })
        }
        reportText += `\nConduta Sugerida: Repouso relativo da área afetada, analgesia conforme prescrição médica e acompanhamento ortopédico ambulatorial.`
      } else if (activeSpecialtyTool === 'psiquiatria') {
        reportText += `AVALIAÇÃO PSIQUIÁTRICA / PSICOLÓGICA:\n`
        reportText += `- Escala PHQ-9 (Depressão): ${phq9Score} pontos (${phq9AllAnswered ? getPHQ9Severity(phq9Score).label : 'Incompleto'})\n`
        reportText += `- Escala GAD-7 (Ansiedade): ${gad7Score} pontos (${gad7AllAnswered ? getGAD7Severity(gad7Score).label : 'Incompleto'})\n`
        if (phq9SelfHarmFlag) {
          reportText += `\n⚠️ ATENÇÃO CLÍNICA: Item 9 do PHQ-9 positivo. Protocolo de segurança e prevenção de suicídio acionado.\n`
        }
        reportText += `\nConduta Sugerida: Psicoterapia regular, avaliação farmacológica contínua e retorno em 30 dias.`
      } else {
        reportText += `AVALIAÇÃO ESPECIALIZADA (${activeSpecialtyTool.toUpperCase()}):\n`
        reportText += `Atendimento realizado sem intercorrências agudas. Segue plano terapêutico e orientações gerais ao paciente.`
      }

      setGeneratedReport(reportText)
      setIsGeneratingAI(false)
    }, 800)
  }

  const handleSendEmail = async () => {
    if (!patientEmail) return alert('Por favor, informe o e-mail do paciente.')
    setIsSending(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ emailTarget: patientEmail, patientName: patientName, prescriptions: prescriptions, docName: docName })
      })
      if (res.ok) {
        alert('E-mail enviado com sucesso!')
        setShowEmailModal(false)
        setPatientEmail('')
      } else {
        const errData = await res.json().catch(() => ({}))
        alert(`Erro ao enviar e-mail: ${errData.error || 'Não autorizado'}`)
      }
    } catch {
      alert('Erro de conexão ao tentar enviar o e-mail.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSaveFavorite = async () => {
    if (!favoriteName) return alert('Dê um nome para a sua receita.')
    if (prescriptions.length === 0) return alert('Adicione pelo menos um item à receita.')
    setIsSavingFavorite(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { alert('Você precisa estar logado.'); setIsSavingFavorite(false); return }
      const newFavorite = { user_id: user.id, name: favoriteName, specialty: docSpecialty, items: prescriptions }
      const { data, error } = await supabase.from('favorite_prescriptions').insert([newFavorite]).select()
      if (error) throw error
      if (data) {
        setFavoriteProtocols([data[0], ...favoriteProtocols])
        setShowSaveFavoriteModal(false)
        setFavoriteName('')
        alert('Protocolo salvo com sucesso!')
      }
    } catch {
      alert('Erro ao salvar o protocolo.')
    } finally {
      setIsSavingFavorite(false)
    }
  }

  const handleDeleteFavorite = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este protocolo?')) return
    try {
      const { error } = await supabase.from('favorite_prescriptions').delete().eq('id', id)
      if (error) throw error
      setFavoriteProtocols(favoriteProtocols.filter(f => f.id !== id))
    } catch {
      alert('Erro ao excluir.')
    }
  }

  const ReceituarioVia = ({ titulo }: { titulo: string }) => (
    <div className="w-1/2 h-full flex flex-col p-8 relative">
      <div className="flex justify-between items-start mb-4 border-b-2 border-primary-blue pb-4">
        <Logo className="h-8" />
        <div className="text-right text-primary-blue">
          <p className="font-bold text-lg uppercase">{titulo}</p>
          <p className="text-sm">Uso Interno/Externo</p>
        </div>
      </div>

      {/* UNIDADE DE ATENDIMENTO / HOSPITAL FIXA NO CABEÇALHO */}
      {docHospital && (
        <div className="mb-2 text-xs font-black text-primary-blue bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-wide border border-blue-100 flex items-center gap-2">
          <Building2 size={14} className="text-action-mint" /> Unidade / Hospital: {docHospital}
        </div>
      )}

      {/* ALERGIAS REGISTRADAS NO CABEÇALHO DA RECEITA PARA ALERTA FÍSICO */}
      {patientAllergiesInput && (
        <div className="mb-3 text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg uppercase tracking-wide border border-red-200 flex items-center gap-2">
          <AlertTriangle size={14} className="text-red-600 animate-pulse" /> Alergias Conhecidas: {patientAllergiesInput}
        </div>
      )}

      <div className="flex gap-4 mb-6 text-sm text-primary-blue font-medium bg-gray-50 p-3 rounded-lg">
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
        <p className="font-bold text-lg uppercase tracking-wide">{docName || 'DR(A). NOME DO MÉDICO'}</p>
        <p className="font-medium text-sm">CRM-{docUF} {docCRM || '000000'}</p>
        <p className="font-bold text-sm tracking-widest mt-1 uppercase">{docSpecialty || 'ESPECIALIDADE MÉDICA'}</p>
      </div>
    </div>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body { background: white; }
          .no-print { display: none !important; }
        }
      `}} />

      {/* ÁREA DE IMPRESSÃO DA RECEITA */}
      <div className="hidden print:flex w-full h-screen bg-white text-black font-sans">
        <ReceituarioVia titulo="1ª VIA - PACIENTE" />
        <div className="w-px bg-dashed border-r-2 border-dashed border-gray-300 h-[90%] my-auto"></div>
        <ReceituarioVia titulo="2ª VIA - FARMÁCIA" />
      </div>

      <div className="print:hidden h-screen flex flex-col bg-bg-ice overflow-hidden font-sans text-primary-blue relative">
        
        {showEmailModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-4">
                <Mail className="text-primary-blue" size={24} />
              </div>
              <h3 className="text-2xl font-black text-primary-blue mb-2">Enviar Prescrição</h3>
              <p className="text-sm text-gray-500 mb-6">Insira o e-mail do paciente para enviar a cópia digital.</p>
              <input
                type="email"
                placeholder="E-mail do paciente..."
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint mb-6 font-medium text-primary-blue"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowEmailModal(false)} className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition-colors">Cancelar</button>
                <button onClick={handleSendEmail} disabled={isSending || prescriptions.length === 0} className="px-6 py-2.5 rounded-xl bg-primary-blue text-white font-bold flex items-center gap-2 hover:bg-[#111e38] transition-colors disabled:opacity-50">
                  {isSending ? 'Enviando...' : 'Enviar Agora'}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSaveFavoriteModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-full mb-4">
                <Star className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-2xl font-black text-primary-blue mb-2">Salvar Protocolo</h3>
              <p className="text-sm text-gray-500 mb-6">Dê um nome para esta receita.</p>
              <input
                type="text"
                placeholder="Ex: Otite Infantil..."
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                className="w-full bg-bg-ice border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-action-mint mb-6 font-bold text-primary-blue uppercase"
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowSaveFavoriteModal(false)} className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition-colors">Cancelar</button>
                <button onClick={handleSaveFavorite} disabled={isSavingFavorite || !favoriteName} className="px-6 py-2.5 rounded-xl bg-yellow-400 text-primary-blue font-bold flex items-center gap-2 hover:bg-yellow-500 transition-colors disabled:opacity-50">
                  {isSavingFavorite ? 'Salvando...' : 'Salvar Favorito'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`text-white text-xs md:text-sm py-2 px-6 flex justify-between items-center shadow-md z-40 transition-colors ${isExpired ? 'bg-red-600 animate-pulse' : 'bg-primary-blue'}`}>
          <span className="flex items-center gap-2 font-medium">
            <Clock size={16} className={isExpired ? 'text-white' : 'text-action-mint'} /> 
            {isExpired ? '⚠️ Seu período de testes de 3 dias expirou!' : 'Status do Acesso:'} <span className="font-bold underline">{timeLeftText}</span>
          </span>
          <button onClick={() => setActiveTab('planos')} className="bg-action-mint text-primary-blue font-bold px-4 py-1.5 rounded-full hover:bg-white transition-colors">
            Ver Planos & Renovar
          </button>
        </div>

        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-30">
          <Logo className="h-8" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {docAvatar ? (
                <img src={docAvatar} alt="Perfil" className="w-9 h-9 rounded-full object-cover border-2 border-primary-blue shadow-sm" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-blue to-[#2A416F] flex items-center justify-center text-white font-bold text-xs">
                  {userEmail ? userEmail.substring(0, 2).toUpperCase() : 'DR'}
                </div>
              )}
              <span className="hidden md:inline font-bold text-sm text-primary-blue">{userEmail || 'Carregando...'}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-red-100 transition-colors" title="Sair">
              <LogOut size={16} /> <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* MENU LATERAL */}
          <aside className="w-20 md:w-64 bg-white border-r border-gray-100 flex flex-col shadow-soft z-20 overflow-y-auto">
            <nav className="flex-1 py-6 px-3">
              <ul className="space-y-2">
                <li onClick={() => setActiveTab('prescricao')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'prescricao' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <FileText size={20} className={activeTab === 'prescricao' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Nova Prescrição</span>
                </li>
                <li onClick={() => setActiveTab('especialistas')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'especialistas' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Stethoscope size={20} className={activeTab === 'especialistas' ? 'text-action-mint' : ''} /> 
                  <span className="hidden md:flex items-center justify-between flex-1 font-bold">
                    Especialistas 
                    {userPlanTier === 'basico' && <span className="bg-yellow-100 text-yellow-700 text-[9px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5"><Lock size={10} /> PRO</span>}
                  </span>
                </li>
                <li onClick={() => setActiveTab('receitas')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'receitas' ? 'bg-bg-ice text-action-mint shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Zap size={20} className={activeTab === 'receitas' ? 'text-action-mint' : ''} /> <span className="hidden md:block font-bold">Receitas Prontas</span>
                </li>
                <li onClick={() => setActiveTab('meus-protocolos')} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${activeTab === 'meus-protocolos' ? 'bg-yellow-50 text-yellow-600 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Bookmark size={20} className={activeTab === 'meus-protocolos' ? 'text-yellow-600' : ''} /> <span className="hidden md:block font-bold">Meus Protocolos</span>
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
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
                <h2 className="text-3xl font-extrabold text-primary-blue mb-2">Seu período de testes de 3 dias expirou</h2>
                <p className="text-gray-500 max-w-md mb-8">Para continuar emitindo prescrições rápidas, escolha um plano abaixo.</p>
                <button onClick={() => setActiveTab('planos')} className="bg-action-mint text-primary-blue font-extrabold text-lg px-8 py-4 rounded-2xl shadow-xl hover:bg-[#00c07d] transition-all">
                  Escolher Meu Plano Agora
                </button>
              </div>
            ) : null}

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
              <h1 className="text-2xl font-bold tracking-tight">
                {activeTab === 'prescricao' && 'Pronto Atendimento & Prescrição'}
                {activeTab === 'especialistas' && 'Ferramentas por Especialidade'}
                {activeTab === 'receitas' && 'Protocolos e Receitas Prontas'}
                {activeTab === 'meus-protocolos' && 'Meus Protocolos (Favoritos)'}
                {activeTab === 'planos' && 'Renovação e Planos de Assinatura'}
                {activeTab === 'configuracoes' && 'Configuração do Perfil e Carimbo'}
              </h1>
            </header>

            {/* ABA DE PRESCRIÇÃO */}
            {activeTab === 'prescricao' && (
              <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                <section className="flex-1 bg-white rounded-3xl shadow-soft flex flex-col overflow-hidden p-4">
                  <div className="space-y-3 mb-4 border-b pb-4">
                    <div className="relative">
                      <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Busca inteligente de medicamentos..." 
                        className="w-full bg-bg-ice border border-gray-200 rounded-2xl py-3 pl-12 pr-4 outline-none text-sm font-medium" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <select value={selectedSpecialtyFilter} onChange={(e) => setSelectedSpecialtyFilter(e.target.value)} className="bg-bg-ice border rounded-xl p-2 text-xs font-bold text-primary-blue outline-none">
                        <option value="todas">Esp: Todas</option>
                        <option value="pediatria">Pediatria</option>
                        <option value="cardiologia">Cardiologia</option>
                        <option value="ortopedia">Ortopedia</option>
                        <option value="geral">Geral</option>
                      </select>
                      <select value={selectedTarjaFilter} onChange={(e) => setSelectedTarjaFilter(e.target.value)} className="bg-bg-ice border rounded-xl p-2 text-xs font-bold text-primary-blue outline-none">
                        <option value="todas">Tarja: Todas</option>
                        <option value="branca">Branca</option>
                        <option value="vermelha">Vermelha</option>
                      </select>
                      <select value={selectedClassFilter} onChange={(e) => setSelectedClassFilter(e.target.value)} className="bg-bg-ice border rounded-xl p-2 text-xs font-bold text-primary-blue outline-none">
                        <option value="todas">Classe: Todas</option>
                        <option value="Analgésico">Analgésico</option>
                        <option value="Antibiótico">Antibiótico</option>
                      </select>
                    </div>
                  </div>

                  {drugInteractionsAlerts.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-3 rounded-r-xl text-xs text-red-700">
                      <p className="font-bold mb-1">⚠️ Alerta de Interação Medicamentosa:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {drugInteractionsAlerts.map((alert, idx) => (<li key={idx}>{alert}</li>))}
                      </ul>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto space-y-2">
                    {ALL_MEDICINES.filter(med => {
                      const matchText = fuzzyMatch(med.n, search) || fuzzyMatch(med.t, search)
                      const matchSpecialty = selectedSpecialtyFilter === 'todas' || (med.specialty && med.specialty.toLowerCase() === selectedSpecialtyFilter)
                      const matchTarja = selectedTarjaFilter === 'todas' || (med.tarja && med.tarja.toLowerCase() === selectedTarjaFilter)
                      const matchClass = selectedClassFilter === 'todas' || (med.t && med.t.toLowerCase().includes(selectedClassFilter.toLowerCase()))
                      return matchText && matchSpecialty && matchTarja && matchClass
                    }).map(med => (
                      <div key={med.id} className="p-3 bg-white border border-gray-100 rounded-2xl hover:shadow-sm transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-primary-blue text-sm">{med.n}</h4>
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{med.t}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {med.f.map((freq: string, i: number) => (
                            <button key={i} onClick={() => handleAddMedicineWithChecks(med, freq)} className="bg-action-mint/10 text-action-mint px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-action-mint hover:text-white transition-colors">
                              + {freq}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                
                <section className="flex-[1.2] bg-white rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50 shrink-0 space-y-3">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">NOME DO PACIENTE</label>
                        <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Digite o nome do paciente..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none font-bold text-primary-blue" />
                      </div>
                      <div className="w-full md:w-40">
                        <label className="block text-xs font-bold text-gray-500 mb-1">DATA</label>
                        <input type="text" value={prescriptionDate} onChange={(e) => setPrescriptionDate(e.target.value)} placeholder="DD/MM/AAAA" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none font-bold text-primary-blue md:text-center" />
                      </div>
                    </div>

                    {/* CAMPO DE ALERGIAS DO PACIENTE */}
                    <div>
                      <label className="block text-xs font-bold text-red-600 mb-1 flex items-center gap-1">
                        <AlertTriangle size={14} /> ALERGIAS DO PACIENTE (SEPARADAS POR VÍRGULA)
                      </label>
                      <input 
                        type="text" 
                        value={patientAllergiesInput} 
                        onChange={(e) => setPatientAllergiesInput(e.target.value)} 
                        placeholder="Ex: Dipirona, Penicilina, AINEs..." 
                        className="w-full bg-red-50/50 border border-red-200 rounded-xl px-4 py-2 outline-none font-bold text-red-700 text-sm focus:border-red-400" 
                      />
                    </div>

                    <div className="bg-bg-ice p-3 rounded-xl border border-gray-200 space-y-2">
                      <p className="text-[11px] font-black text-primary-blue uppercase tracking-wide">Prontuário SOAP Adaptado — {docSpecialty || 'CLÍNICO GERAL'}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="S — Queixa principal / Subjetivo" className="bg-white border rounded-lg p-1.5 text-xs outline-none" />
                        <input type="text" placeholder="O — Sinais Vitais / Exame Físico" className="bg-white border rounded-lg p-1.5 text-xs outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="A — Avaliação / CID-10" className="bg-white border rounded-lg p-1.5 text-xs outline-none" />
                        <input type="text" placeholder="P — Conduta / Plano" className="bg-white border rounded-lg p-1.5 text-xs outline-none" />
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

                  <div className="p-4 border-t flex items-center justify-between bg-gray-50 shrink-0">
                    <button onClick={() => setShowSaveFavoriteModal(true)} disabled={prescriptions.length === 0} className="px-4 py-2.5 rounded-xl text-yellow-600 hover:bg-yellow-100 font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                      <Star size={18} /> <span className="hidden md:inline">Salvar Favorito</span>
                    </button>
                    <div className="flex gap-2">
                      <button onClick={handleClear} className="px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-200 font-bold transition-colors">Limpar</button>
                      <button onClick={() => setShowEmailModal(true)} className="px-4 md:px-5 py-2.5 rounded-xl bg-primary-blue text-white font-bold flex items-center gap-2 shadow-md hover:bg-[#111e38] transition-colors"><Mail size={16} /> Enviar</button>
                      <button onClick={handlePrint} className="px-4 md:px-6 py-2.5 rounded-xl bg-action-mint text-white font-bold flex items-center gap-2 shadow-lg hover:bg-[#00c07d] transition-colors"><Printer size={16} /> Imprimir</button>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* ABA ESPECIALISTAS */}
            {activeTab === 'especialistas' && (
              <div className="flex-1 bg-white rounded-3xl p-6 overflow-y-auto flex flex-col gap-6 relative">
                
                {userPlanTier === 'basico' && (
                  <div className="bg-gradient-to-r from-primary-blue to-[#2A416F] text-white p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-action-mint/20 flex items-center justify-center text-action-mint">
                        <Lock size={22} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm">Modo de Visualização — Plano Básico (Clínico Geral)</h4>
                        <p className="text-xs text-gray-300">Você pode visualizar todas as perguntas, escalas e mapas. Para interagir e gerar laudos, faça o upgrade para o **Plano PRO**.</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('planos')} className="bg-action-mint text-primary-blue font-extrabold text-xs px-5 py-2.5 rounded-xl hover:bg-[#00c07d] transition-all shadow shrink-0">
                      Fazer Upgrade para PRO
                    </button>
                  </div>
                )}

                <div className="bg-bg-ice p-4 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-4 shrink-0">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1">NOME DO PACIENTE (UNIVERSAL)</label>
                    <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Digite o nome do paciente..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none font-bold text-primary-blue text-sm" />
                  </div>
                  <div className="w-full md:w-48">
                    <label className="block text-xs font-bold text-gray-500 mb-1">DATA</label>
                    <input type="text" value={prescriptionDate} onChange={(e) => setPrescriptionDate(e.target.value)} placeholder="DD/MM/AAAA" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 outline-none font-bold text-primary-blue text-sm md:text-center" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-b pb-4 shrink-0">
                  {[
                    { id: 'ortopedia', label: '🦴 Ortopedia & Traumatologia' },
                    { id: 'psiquiatria', label: '🧠 Psiquiatria / Psicologia (PHQ-9 & GAD-7)' },
                    { id: 'pediatria', label: '👶 Pediatria' },
                    { id: 'cardiologia', label: '❤️ Cardiologia' },
                    { id: 'ginecologia', label: '🌸 Ginecologia' },
                  ].map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => setActiveSpecialtyTool(spec.id)}
                      className={`px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                        activeSpecialtyTool === spec.id
                          ? 'bg-primary-blue text-white shadow-md scale-105'
                          : 'bg-bg-ice text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {spec.label}
                    </button>
                  ))}
                </div>

                {activeSpecialtyTool === 'ortopedia' && (
                  <div className="space-y-6">
                    <div className="bg-bg-ice p-6 rounded-3xl border border-gray-200 space-y-4">
                      <h3 className="text-lg font-bold text-primary-blue">Módulo de Ortopedia & Dor</h3>
                      
                      <div className="bg-white p-4 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-xs font-bold text-gray-600">Escala Visual Analógica de Dor (EVA)</label>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                            painLevel === null ? 'bg-gray-100 text-gray-500' :
                            painLevel <= 3 ? 'bg-yellow-100 text-yellow-700' :
                            painLevel <= 7 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {painLevel !== null ? `Nível ${painLevel} / 10` : 'Não avaliada'}
                          </span>
                        </div>
                        <div className="flex gap-1 justify-between">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button 
                              key={num} 
                              onClick={() => {
                                if (handleRestrictedAction()) return
                                setPainLevel(num)
                              }} 
                              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${painLevel === num ? 'bg-primary-blue text-white shadow-md scale-105' : 'bg-bg-ice text-gray-600 hover:bg-gray-200'}`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="font-bold text-sm text-primary-blue">Mapa Anatômico de Lesão</h4>
                            <p className="text-xs text-gray-400">Visualização de regiões anatômicas para marcação.</p>
                          </div>
                          <div className="flex gap-1 bg-bg-ice p-1 rounded-xl">
                            <button onClick={() => setBodySide('frente')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${bodySide === 'frente' ? 'bg-primary-blue text-white' : 'text-gray-600'}`}>Frente</button>
                            <button onClick={() => setBodySide('costas')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${bodySide === 'costas' ? 'bg-primary-blue text-white' : 'text-gray-600'}`}>Costas</button>
                          </div>
                        </div>

                        <div className="max-w-md mx-auto flex flex-col items-center gap-3 py-4">
                          {bodySide === 'frente' ? (
                            <div className="w-full grid grid-cols-2 gap-3">
                              {['Cabeça / Face', 'Ombro Direito', 'Ombro Esquerdo', 'Tórax / Abdome', 'Membro Superior D.', 'Membro Superior E.', 'Quadril / Bacia', 'Joelho Direito', 'Joelho Esquerdo', 'Tornozelo / Pé D.', 'Tornozelo / Pé E.'].map((part) => (
                                <button
                                  key={part}
                                  onClick={() => {
                                    if (handleRestrictedAction()) return
                                    setSelectedBodyPart(part)
                                  }}
                                  className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                                    selectedBodyPart === part
                                      ? 'bg-red-600 text-white border-red-600 shadow-lg scale-105 animate-pulse'
                                      : 'bg-bg-ice text-gray-700 border-gray-200 hover:bg-gray-200'
                                  }`}
                                >
                                  <span className={`w-2.5 h-2.5 rounded-full ${selectedBodyPart === part ? 'bg-white' : 'bg-gray-400'}`}></span>
                                  {part}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="w-full grid grid-cols-2 gap-3">
                              {['Cabeça (Posterior)', 'Coluna Cervical', 'Coluna Dorsal', 'Coluna Lombar', 'Ombro Costas D.', 'Ombro Costas E.', 'Glúteo / Região Sacra', 'Coxa / Perna D.', 'Coxa / Perna E.', 'Calcanhar / Pé D.', 'Calcanhar / Pé E.'].map((part) => (
                                <button
                                  key={part}
                                  onClick={() => {
                                    if (handleRestrictedAction()) return
                                    setSelectedBodyPart(part)
                                  }}
                                  className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                                    selectedBodyPart === part
                                      ? 'bg-red-600 text-white border-red-600 shadow-lg scale-105 animate-pulse'
                                      : 'bg-bg-ice text-gray-700 border-gray-200 hover:bg-gray-200'
                                  }`}
                                >
                                  <span className={`w-2.5 h-2.5 rounded-full ${selectedBodyPart === part ? 'bg-white' : 'bg-gray-400'}`}></span>
                                  {part}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {selectedBodyPart && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex justify-between items-center text-xs text-red-700">
                            <span>Região Ativa: <strong>{selectedBodyPart}</strong></span>
                            <button onClick={handleAddPainRecord} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-red-700 transition-colors">
                              + Incluir Dor
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3">
                        <h4 className="font-bold text-sm text-primary-blue">Histórico de Queixas e Dor Registradas</h4>
                        {painHistory.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">Nenhuma região incluída no histórico ainda.</p>
                        ) : (
                          <ul className="space-y-2">
                            {painHistory.map((item) => (
                              <li key={item.id} className="flex justify-between items-center bg-bg-ice p-3 rounded-xl border border-gray-200 text-xs font-medium">
                                <div className="flex items-center gap-3">
                                  <span className="w-3 h-3 rounded-full bg-red-600"></span>
                                  <span><strong>{item.part}</strong> ({item.side}) — Dor EVA: <strong className="text-red-600">{item.level}/10</strong></span>
                                  <span className="text-gray-400 text-[10px]">({item.timestamp})</span>
                                </div>
                                <button onClick={() => setPainHistory(painHistory.filter(h => h.id !== item.id))} className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-white transition-colors">
                                  <X size={16} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="pt-2">
                        <button onClick={handleGenerateAIReport} disabled={isGeneratingAI} className="w-full bg-action-mint text-primary-blue font-extrabold py-3.5 rounded-2xl shadow-md hover:bg-[#00c07d] transition-all flex items-center justify-center gap-2">
                          {userPlanTier === 'basico' ? <Lock size={18} /> : <Sparkles size={18} />} 
                          {isGeneratingAI ? 'Gerando Laudo com IA...' : userPlanTier === 'basico' ? 'Gerar Laudo com IA (Exclusivo PRO)' : 'Gerar Laudo / Relatório Automático com IA'}
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {activeSpecialtyTool === 'psiquiatria' && (
                  <div className="bg-bg-ice p-6 rounded-3xl border border-gray-200 space-y-6">
                    <h3 className="text-lg font-bold text-primary-blue">Escalas Clínicas de Triagem (PHQ-9 & GAD-7)</h3>
                    <p className="text-xs text-gray-500">Nas últimas 2 semanas, com que frequência o(a) paciente foi incomodado(a) por:</p>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-primary-blue">PHQ-9 (Rastreio de Depressão)</span>
                        {phq9AllAnswered && (
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${getPHQ9Severity(phq9Score).color}`}>
                            {phq9Score} pts — {getPHQ9Severity(phq9Score).label}
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {PHQ9_QUESTIONS.map((q, qIdx) => (
                          <div key={qIdx} className="text-xs border-b border-gray-100 pb-3">
                            <p className="text-gray-700 mb-2 font-medium">{qIdx + 1}. {q}</p>
                            <div className="grid grid-cols-4 gap-2">
                              {SCALE_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    if (handleRestrictedAction()) return
                                    const updated = [...phq9Answers]
                                    updated[qIdx] = opt.value
                                    setPhq9Answers(updated)
                                  }}
                                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
                                    phq9Answers[qIdx] === opt.value
                                      ? 'bg-primary-blue text-white shadow-sm'
                                      : 'bg-bg-ice text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {phq9SelfHarmFlag && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl text-xs text-red-700 font-medium">
                          ⚠️ Item 9 positivo — avaliar risco de autolesão/suicídio antes de encerrar o atendimento.
                        </div>
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black text-primary-blue">GAD-7 (Rastreio de Ansiedade)</span>
                        {gad7AllAnswered && (
                          <span className={`text-xs font-black px-3 py-1 rounded-full ${getGAD7Severity(gad7Score).color}`}>
                            {gad7Score} pts — {getGAD7Severity(gad7Score).label}
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        {GAD7_QUESTIONS.map((q, qIdx) => (
                          <div key={qIdx} className="text-xs border-b border-gray-100 pb-3">
                            <p className="text-gray-700 mb-2 font-medium">{qIdx + 1}. {q}</p>
                            <div className="grid grid-cols-4 gap-2">
                              {SCALE_OPTIONS.map(opt => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    if (handleRestrictedAction()) return
                                    const updated = [...gad7Answers]
                                    updated[qIdx] = opt.value
                                    setGad7Answers(updated)
                                  }}
                                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
                                    gad7Answers[qIdx] === opt.value
                                      ? 'bg-primary-blue text-white shadow-sm'
                                      : 'bg-bg-ice text-gray-600 hover:bg-gray-200'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button onClick={handleGenerateAIReport} disabled={isGeneratingAI} className="w-full bg-action-mint text-primary-blue font-extrabold py-3.5 rounded-2xl shadow-md hover:bg-[#00c07d] transition-all flex items-center justify-center gap-2">
                        {userPlanTier === 'basico' ? <Lock size={18} /> : <Sparkles size={18} />} 
                        {isGeneratingAI ? 'Gerando Laudo com IA...' : userPlanTier === 'basico' ? 'Gerar Laudo com IA (Exclusivo PRO)' : 'Gerar Laudo / Relatório Automático com IA'}
                      </button>
                    </div>

                  </div>
                )}

                {generatedReport && userPlanTier === 'pro' && (
                  <div className="bg-white border-2 border-action-mint rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <h4 className="font-extrabold text-primary-blue flex items-center gap-2">
                        <Sparkles className="text-action-mint" size={20} /> Relatório / Laudo Gerado por IA (Editável)
                      </h4>
                      <button onClick={() => setGeneratedReport('')} className="text-gray-400 hover:text-red-600"><X size={18}/></button>
                    </div>
                    
                    <div className="bg-bg-ice p-6 rounded-2xl border border-gray-200 space-y-4">
                      <div className="flex justify-between items-start border-b border-primary-blue/20 pb-4">
                        <Logo className="h-6" />
                        <div className="text-right text-primary-blue text-xs">
                          <p className="font-bold uppercase">LAUDO MÉDICO ESPECIALIZADO</p>
                          <p>Data: {prescriptionDate || new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-xs text-primary-blue font-medium mb-2">
                        <span>Paciente: <strong className="uppercase">{patientName || 'NÃO INFORMADO'}</strong></span>
                      </div>
                      
                      <textarea
                        value={generatedReport}
                        onChange={(e) => setGeneratedReport(e.target.value)}
                        rows={10}
                        className="w-full font-sans text-xs text-gray-800 bg-white p-4 rounded-xl border border-gray-300 focus:border-action-mint outline-none leading-relaxed resize-y shadow-inner"
                        placeholder="Edite o laudo médico aqui..."
                      />
                      
                      <div className="pt-8 mt-8 border-t border-gray-300 flex flex-col items-center justify-center text-primary-blue">
                        <div className="w-48 border-b border-primary-blue mb-1"></div>
                        <p className="font-bold text-xs uppercase">{docName || 'DR(A). NOME DO MÉDICO'}</p>
                        <p className="font-medium text-[10px]">CRM-{docUF} {docCRM || '000000'}</p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <button onClick={() => { navigator.clipboard.writeText(generatedReport); alert('Laudo copiado para a área de transferência!'); }} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">Copiar Texto</button>
                      <button onClick={handlePrint} className="px-5 py-2.5 bg-action-mint text-primary-blue rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md hover:bg-[#00c07d] transition-colors"><Printer size={16} /> Imprimir Laudo</button>
                    </div>
                  </div>
                )}

                {activeSpecialtyTool === 'pediatria' && (
                  <div className="bg-bg-ice p-6 rounded-3xl border border-gray-200 space-y-4">
                    <h3 className="text-lg font-bold text-primary-blue">Ferramentas de Pediatria</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Peso da Criança (kg)</label><input type="number" placeholder="Ex: 12.5" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Idade</label><input type="text" placeholder="Ex: 2 anos" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Curva OMS</label><input type="text" placeholder="Percentil Peso/Altura" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                    </div>
                  </div>
                )}

                {activeSpecialtyTool === 'cardiologia' && (
                  <div className="bg-bg-ice p-6 rounded-3xl border border-gray-200 space-y-4">
                    <h3 className="text-lg font-bold text-primary-blue">Cardiologia & Hemodinâmica</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Pressão Arterial Média</label><input type="text" placeholder="120/80 mmHg" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Escala de Risco (Framingham)</label><input type="text" placeholder="Calcular risco cardiovascular" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                    </div>
                  </div>
                )}

                {activeSpecialtyTool === 'ginecologia' && (
                  <div className="bg-bg-ice p-6 rounded-3xl border border-gray-200 space-y-4">
                    <h3 className="text-lg font-bold text-primary-blue">Ginecologia & Obstetrícia</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">DUM</label><input type="date" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Fórmula Obstétrica</label><input type="text" placeholder="G_ P_ A_" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                      <div className="bg-white p-4 rounded-2xl border"><label className="text-xs font-bold text-gray-500">Rastreio Preventivo</label><input type="text" placeholder="Papanicolau / Mamografia" onClick={handleRestrictedAction} className="w-full border rounded-xl p-2 mt-1 text-sm outline-none cursor-pointer" /></div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {activeTab === 'meus-protocolos' && (
              <div className="flex-1 bg-white rounded-3xl p-6 overflow-y-auto">
                {favoriteProtocols.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Bookmark size={64} className="mb-4 text-yellow-200" />
                    <h3 className="text-xl font-bold text-primary-blue mb-2">Nenhum protocolo salvo</h3>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {favoriteProtocols.map(fav => (
                      <div key={fav.id} className="border border-gray-200 rounded-2xl p-5 hover:border-yellow-400 transition-colors relative group">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-primary-blue uppercase">{fav.name}</h3>
                            <p className="text-sm text-yellow-600 font-bold bg-yellow-50 inline-block px-2 py-0.5 rounded mt-1">{fav.specialty}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleDeleteFavorite(fav.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                            <button onClick={() => {applyReceita({items: fav.items}); setActiveTab('prescricao')}} className="bg-primary-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md">Aplicar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                        <button onClick={() => {applyReceita(receita); setActiveTab('prescricao')}} className="bg-primary-blue text-white px-4 py-2 rounded-xl text-sm font-bold">Aplicar Receita</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'planos' && (
              <div className="flex-1 bg-white rounded-3xl p-8 overflow-y-auto text-center space-y-10">
                <div>
                  <h2 className="text-3xl font-black text-primary-blue mb-2">Escolha o plano ideal para a sua prática médica</h2>
                  <p className="text-gray-500 text-sm">Evolua seu consultório com prescrição rápida ou desbloqueie ferramentas avançadas com IA.</p>
                </div>

                <div className="space-y-4 text-left max-w-5xl mx-auto">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <span className="bg-gray-100 text-primary-blue font-extrabold text-xs px-3 py-1 rounded-lg uppercase tracking-wider">Essencial</span>
                    <h3 className="font-extrabold text-lg text-primary-blue">Plano Básico (Clínico Geral)</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 p-6 rounded-3xl flex flex-col justify-between hover:border-primary-blue transition-all">
                      <div>
                        <span className="text-gray-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100">Básico Mensal</span>
                        <h4 className="font-bold text-base text-primary-blue mt-3 mb-1">Mensal</h4>
                        <div className="text-3xl font-black text-primary-blue mb-4">R$ 47,90</div>
                        <p className="text-xs text-gray-500 mb-6">Prescrição rápida, busca inteligente, receitas prontas e envio de e-mail ilimitado.</p>
                      </div>
                      <a href="https://pay.kiwify.com.br/SEU-LINK-BASICO-MENSAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl border-2 border-primary-blue font-bold text-primary-blue hover:bg-primary-blue hover:text-white transition-all text-sm">Assinar Básico Mensal</a>
                    </div>

                    <div className="bg-primary-blue text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between relative transform md:-translate-y-2 border-2 border-action-mint">
                      <div className="absolute -top-3.5 right-6 bg-action-mint text-primary-blue font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                        Mais Comprado ⭐
                      </div>
                      <div>
                        <span className="bg-action-mint/20 text-action-mint text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Básico Trimestral</span>
                        <h4 className="font-bold text-base mt-3 mb-1">Trimestral</h4>
                        <div className="text-3xl font-black text-action-mint mb-4">R$ 119,90</div>
                        <p className="text-xs text-gray-300 mb-6">Economia inteligente para plantonistas no dia a dia do consultório.</p>
                      </div>
                      <a href="https://pay.kiwify.com.br/SEU-LINK-BASICO-TRIMESTRAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl bg-action-mint font-bold text-primary-blue hover:bg-[#00c07d] transition-all shadow-md text-sm">Assinar Básico Trimestral</a>
                    </div>

                    <div className="border border-gray-200 p-6 rounded-3xl flex flex-col justify-between hover:border-primary-blue transition-all">
                      <div>
                        <span className="text-gray-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gray-100">Básico Anual</span>
                        <h4 className="font-bold text-base text-primary-blue mt-3 mb-1">Anual</h4>
                        <div className="text-3xl font-black text-primary-blue mb-4">R$ 347,90</div>
                        <p className="text-xs text-gray-500 mb-6">Máximo custo-benefício para médicos generalistas com compromisso anual.</p>
                      </div>
                      <a href="https://pay.kiwify.com.br/SEU-LINK-BASICO-ANUAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl border-2 border-primary-blue font-bold text-primary-blue hover:bg-primary-blue hover:text-white transition-all text-sm">Assinar Básico Anual</a>
                    </div>
                  </div>
                </div>

                <div className="relative flex py-2 items-center max-w-5xl mx-auto">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink mx-4 text-primary-blue text-xs font-bold uppercase tracking-wider">Ou escolha o nível profissional completo</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <div className="space-y-4 text-left max-w-5xl mx-auto">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <span className="bg-action-mint/20 text-primary-blue font-extrabold text-xs px-3 py-1 rounded-lg uppercase tracking-wider">Avançado</span>
                    <h3 className="font-extrabold text-lg text-primary-blue">Planos PRO (Especialistas & Laudos com IA)</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 p-6 rounded-3xl flex flex-col justify-between hover:border-action-mint transition-all">
                      <div>
                        <span className="bg-primary-blue/10 text-primary-blue text-[10px] font-black uppercase px-2 py-0.5 rounded-full">PRO Mensal</span>
                        <h4 className="font-bold text-base text-primary-blue mt-3 mb-1">Mensal</h4>
                        <div className="text-3xl font-black text-primary-blue mb-4">R$ 59,90</div>
                        <p className="text-xs text-gray-500 mb-6">Acesso total às ferramentas de Ortopedia, Psiquiatria, Pediatria e Laudos com IA.</p>
                      </div>
                      <a href="https://pay.kiwify.com.br/SEU-LINK-PRO-MENSAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl border-2 border-primary-blue font-bold text-primary-blue hover:bg-primary-blue hover:text-white transition-all text-sm">Assinar Pro Mensal</a>
                    </div>

                    <div className="bg-primary-blue text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between relative transform md:-translate-y-2 border-2 border-action-mint">
                      <div className="absolute -top-3.5 right-6 bg-action-mint text-primary-blue font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                        Mais Comprado ⭐
                      </div>
                      <div>
                        <span className="bg-action-mint/20 text-action-mint text-[10px] font-black uppercase px-2 py-0.5 rounded-full">PRO Trimestral</span>
                        <h4 className="font-bold text-base mt-3 mb-1">Trimestral</h4>
                        <div className="text-3xl font-black text-action-mint mb-4">R$ 139,90</div>
                        <p className="text-xs text-gray-300 mb-6">Economia inteligente para especialistas com desbloqueio completo por 3 meses.</p>
                      </div>
                      <a href="https://pay.kiwify.com.br/SEU-LINK-PRO-TRIMESTRAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl bg-action-mint font-bold text-primary-blue hover:bg-[#00c07d] transition-all shadow-md text-sm">Assinar Pro Trimestral</a>
                    </div>

                    <div className="border border-gray-200 p-6 rounded-3xl flex flex-col justify-between hover:border-action-mint transition-all">
                      <div>
                        <span className="bg-yellow-100 text-yellow-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">PRO Anual (Melhor Valor)</span>
                        <h4 className="font-bold text-base text-primary-blue mt-3 mb-1">Anual</h4>
                        <div className="text-3xl font-black text-primary-blue mb-4">R$ 387,90</div>
                        <p className="text-xs text-gray-500 mb-6">Máximo desempenho médico com desconto anual garantido em todas as atualizações.</p>
                      </div>
                      <a href="https://pay.kiwify.com.br/SEU-LINK-PRO-ANUAL" target="_blank" rel="noopener noreferrer" className="block text-center w-full py-3 rounded-xl border-2 border-primary-blue font-bold text-primary-blue hover:bg-primary-blue hover:text-white transition-all text-sm">Assinar Pro Anual</a>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'configuracoes' && (
              <div className="flex-1 bg-white rounded-3xl p-8 max-w-2xl shadow-soft overflow-y-auto">
                 <h3 className="text-xl font-bold text-primary-blue mb-6 border-b pb-4">Personalização do Perfil e Carimbo</h3>
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Foto do Perfil</label>
                     <div className="flex items-center gap-4">
                       {docAvatar ? <img src={docAvatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-primary-blue shadow-md" /> : <div className="w-16 h-16 rounded-full bg-bg-ice border-2 border-dashed flex items-center justify-center text-gray-400 font-bold">Sem Foto</div>}
                       <label className="bg-primary-blue text-white px-4 py-2 rounded-xl text-sm font-bold cursor-pointer hover:bg-[#111e38] transition-colors inline-flex items-center gap-2"><Camera size={16} /> Escolher Foto<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>
                     </div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Nome do Médico</label>
                     <input type="text" value={docName} onChange={(e) => setDocName(e.target.value.toUpperCase())} className="w-full bg-bg-ice border rounded-xl px-4 py-3 outline-none font-bold uppercase" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-sm font-bold text-gray-600 mb-2">CRM</label><input type="text" value={docCRM} onChange={(e) => setDocCRM(e.target.value)} className="w-full bg-bg-ice border rounded-xl px-4 py-3 outline-none" /></div>
                     <div><label className="block text-sm font-bold text-gray-600 mb-2">UF</label><select value={docUF} onChange={(e) => setDocUF(e.target.value)} className="w-full bg-bg-ice border rounded-xl px-4 py-3 outline-none">{['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => <option key={uf} value={uf}>{uf}</option>)}</select></div>
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Especialidade</label>
                     <input type="text" value={docSpecialty} onChange={(e) => setDocSpecialty(e.target.value.toUpperCase())} className="w-full bg-bg-ice border rounded-xl px-4 py-3 outline-none font-bold uppercase" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-gray-600 mb-2">Unidade de Atendimento / Hospital (Plantão do Dia)</label>
                     <input type="text" value={docHospital} onChange={(e) => setDocHospital(e.target.value.toUpperCase())} placeholder="Ex: UPA Central / Hospital Municipal..." className="w-full bg-bg-ice border rounded-xl px-4 py-3 outline-none font-bold uppercase" />
                   </div>
                   <div className="pt-6 border-t flex items-center gap-4">
                     <button onClick={handleSaveProfile} className="bg-action-mint text-primary-blue font-extrabold px-8 py-3 rounded-xl shadow-md flex items-center gap-2"><Save size={20} /> Salvar</button>
                     {isSaved && <span className="text-action-mint font-bold flex items-center gap-1"><CheckCircle size={18} /> Salvo!</span>}
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
