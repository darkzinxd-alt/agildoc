import { Check, Star } from 'lucide-react'
import { Logo } from '../../components/Logo'

export default function Planos() {
  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-bg-ice py-12 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-action-mint/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-blue mb-6 tracking-tight">
            Seu tempo vale ouro. <br/>Sua segurança não tem preço.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
            Seu período de teste acabou. Escolha um plano para continuar prescrevendo com agilidade e evite erros no plantão.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Mensal */}
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col hover:border-gray-300 transition-all">
            <h3 className="text-xl font-bold text-primary-blue mb-2">Plano Mensal</h3>
            <p className="text-sm text-gray-400 font-medium mb-6">Flexibilidade para o seu dia a dia.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-primary-blue">R$ 47,90</span>
              <span className="text-gray-400 font-medium">/mês</span>
            </div>
            <button className="w-full py-4 rounded-2xl border-2 border-primary-blue text-primary-blue font-bold text-lg hover:bg-gray-50 transition-all active:scale-95 mb-8">
              Assinar Mensal
            </button>
            <ul className="space-y-4 flex-1">
              {[
                'Acesso total pelo Celular ou PC',
                'Prescrições Hospitalares ilimitadas',
                'Calculadora Pediátrica',
                'Suporte via e-mail'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                  <div className="bg-action-mint/20 p-1 rounded-full"><Check size={14} className="text-action-mint stroke-[3]" /></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Trimestral (Destaque) */}
          <div className="bg-primary-blue p-1 relative rounded-3xl shadow-float transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-action-mint text-primary-blue font-black px-6 py-1.5 rounded-full text-sm flex items-center gap-2 shadow-lg">
              <Star size={16} className="fill-primary-blue" /> MAIS ESCOLHIDO
            </div>
            
            <div className="bg-primary-blue p-8 rounded-[22px] flex flex-col h-full text-white">
              <h3 className="text-xl font-bold mb-2">Plano Trimestral</h3>
              <p className="text-sm text-white/60 font-medium mb-6">Equivale a apenas R$ 39,96 por mês.</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-action-mint">R$ 119,90</span>
                <span className="text-white/60 font-medium">/tri</span>
              </div>
              <button className="w-full py-4 rounded-2xl bg-action-mint text-primary-blue font-bold text-lg hover:bg-[#00e394] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 mb-8">
                Assinar Trimestral
              </button>
              <ul className="space-y-4 flex-1">
                {[
                  'Tudo do plano Mensal',
                  'Kits de Emergência Prontos',
                  'Checagem de Interação Medicamentosa',
                  'Suporte Prioritário no WhatsApp'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90 font-medium text-sm">
                    <div className="bg-action-mint p-1 rounded-full"><Check size={14} className="text-primary-blue stroke-[3]" /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Anual */}
          <div className="bg-white p-8 rounded-3xl shadow-soft border border-gray-100 flex flex-col hover:border-gray-300 transition-all">
            <h3 className="text-xl font-bold text-primary-blue mb-2">Plano Anual</h3>
            <p className="text-sm text-gray-400 font-medium mb-6">Equivale a R$ 28,99/mês (2 meses grátis).</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-primary-blue">R$ 347,90</span>
              <span className="text-gray-400 font-medium">/ano</span>
            </div>
            <button className="w-full py-4 rounded-2xl border-2 border-primary-blue text-primary-blue font-bold text-lg hover:bg-gray-50 transition-all active:scale-95 mb-8">
              Assinar Anual
            </button>
            <ul className="space-y-4 flex-1">
              {[
                'Tudo do plano Trimestral',
                'Download de Guias de Conduta PDF',
                'Acesso gratuito a novas atualizações',
                'Acesso a comunidade de assinantes'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                  <div className="bg-action-mint/20 p-1 rounded-full"><Check size={14} className="text-action-mint stroke-[3]" /></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
