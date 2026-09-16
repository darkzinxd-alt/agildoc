import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const body = JSON.parse(rawBody)
    
    // (Opcional de segurança) Validação do Token da Kiwify se configurado
    const signature = req.headers.get('x-kiwify-signature')
    const secret = process.env.KIWIFY_WEBHOOK_SECRET
    
    if (secret && signature) {
      const hash = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
      if (hash !== signature) {
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 })
      }
    }

    // Dados da compra enviados pela Kiwify
    const { order_status, customer } = body
    
    // Se o status for 'paid' (Compra aprovada) ou renovado
    if (order_status === 'paid' || order_status === 'active') {
      const email = customer.email
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      // Atualiza o perfil do médico para Premium (active)
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('email', email)
        
      if (error) {
        console.error('Erro ao atualizar usuário no Supabase:', error)
      } else {
        console.log(`Sucesso: Médico ${email} atualizado para Premium!`)
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
