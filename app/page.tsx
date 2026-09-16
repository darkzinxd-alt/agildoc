'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '../components/Logo'
import { ShieldCheck, Zap } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGoogleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-bg-ice flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-action-mint/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-blue/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-soft border border-white w-full max-w-md text-center relative z-10 transition-all duration-500 hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <Logo className="h-12" />
        </div>
        
        <div className="space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-primary-blue">Bem-vindo ao plantão do futuro.</h2>
          <p className="text-gray-500 font-medium flex items-center justify-center gap-2 text-sm">
             Prescrições ágeis. Segurança absoluta.
          </p>
        </div>
        
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="group relative w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-primary-blue font-bold text-lg py-4 px-4 rounded-2xl hover:border-action-mint hover:shadow-float transition-all duration-300 focus:ring-4 focus:ring-action-mint/30 outline-none active:scale-[0.98]"
        >
          <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Autenticando de forma segura...' : 'Entrar com Google'}
        </button>
        
        <div className="mt-8 flex justify-center gap-6 border-t border-gray-100 pt-6">
           <div className="flex flex-col items-center text-xs text-gray-400 gap-1">
              <ShieldCheck size={20} className="text-gray-300"/>
              <span>100% Seguro LGPD</span>
           </div>
           <div className="flex flex-col items-center text-xs text-gray-400 gap-1">
              <Zap size={20} className="text-gray-300"/>
              <span>Setup em 1 clique</span>
           </div>
        </div>
      </div>
    </div>
  )
}
