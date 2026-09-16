import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Dados da compra enviados pela Kiwify
    const { order_status, customer } = body
    
    // Se o status for 'paid' (pagamento aprovado)
    if (order_status === 'paid') {
      const email = customer.email
      
      // Conecta ao Supabase usando a Chave Mestre (Service Role Key)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      // Atualiza o perfil do médico para Premium (active)
      await supabase
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('email', email)
        
      console.log(`Sucesso: Médico ${email} atualizado para Premium!`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
