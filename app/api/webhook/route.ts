import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const PEZA_SYSTEM = `You are Peza, Zambia's WhatsApp commerce assistant. 
Be warm, friendly and proudly Zambian. Use occasional Nyanja greetings.
Keep responses SHORT — under 300 characters when possible.
Use emojis naturally. Currency is Zambian Kwacha (K).`

async function getConversation(phone: string) {
  let { data } = await supabase
    .from('conversations')
    .select('*')
    .eq('whatsapp_number', phone)
    .single()

  if (!data) {
    const { data: newConv } = await supabase
      .from('conversations')
      .insert({ whatsapp_number: phone, state: 'IDLE', cart: [] })
      .select()
      .single()
    data = newConv
  }
  return data
}

async function updateConversation(phone: string, updates: object) {
  await supabase
    .from('conversations')
    .update({ ...updates, last_active: new Date().toISOString() })
    .eq('whatsapp_number', phone)
}

async function getOrCreateCustomer(phone: string) {
  let { data } = await supabase
    .from('customers')
    .select('*')
    .eq('whatsapp_number', phone)
    .single()

  if (!data) {
    const { data: newCustomer } = await supabase
      .from('customers')
      .insert({ whatsapp_number: phone })
      .select()
      .single()
    data = newCustomer
  }
  return data
}

async function handleMessage(phone: string, message: string): Promise<string> {
  const conv = await getConversation(phone)
  await getOrCreateCustomer(phone)
  const msg = message.trim().toLowerCase()
  const msgRaw = message.trim()

  // Global commands
  if (['hi','hello','mwabonwa','hey','start','0','menu','home'].includes(msg)) {
    await updateConversation(phone, { state: 'MAIN_MENU', cart: [], current_business_id: null })
    return `Mwabonwa! 👋 Welcome to *Peza* — Zambia's commerce platform.

What would you like to do?

1️⃣ 🛒 Shop from local businesses
2️⃣ 🌾 AgriMarket
3️⃣ 📈 Market prices
4️⃣ 🏛 Government services
5️⃣ 🏪 Register your business
6️⃣ 📦 Track my orders

Reply with a number!`
  }

  if (msg === 'cart') {
    const cart = conv?.cart || []
    if (!cart.length) return `Your cart is empty 🛒\n\nType *menu* to start shopping!`
    const items = cart.map((i: {name: string; qty: number; price: number}) => 
      `• ${i.name} x${i.qty} — K${i.price * i.qty}`).join('\n')
    const total = cart.reduce((s: number, i: {price: number; qty: number}) => s + i.price * i.qty, 0)
    return `*Your Cart* 🛒\n\n${items}\n\n*Total: K${total}*\n\nType *checkout* to order or *clear* to empty cart.`
  }

  if (msg === 'clear') {
    await updateConversation(phone, { cart: [], state: 'MAIN_MENU' })
    return `Cart cleared ✅\n\nType *menu* to start over.`
  }

  if (msg === 'help') {
    return `*Peza Help* 🆘\n\nType *menu* — main menu\nType *cart* — view cart\nType *0* — start over\n\nNeed help? Email: hello@peza.africa`
  }

  const state = conv?.state || 'IDLE'

  if (state === 'MAIN_MENU' || state === 'IDLE') {
    const choice = parseInt(msg)

    if (choice === 1) {
      await updateConversation(phone, { state: 'BROWSE_CATEGORY' })
      return `🛒 *Shop by Category*\n\n1. 🍅 Food & Groceries\n2. 👗 Fashion\n3. 🌾 Agriculture\n4. 🔧 Hardware\n5. 💄 Beauty & Salon\n6. 📦 General Retail\n\nReply with a number:`
    }
    if (choice === 2) {
      await updateConversation(phone, { state: 'AGRI_MENU' })
      return `🌾 *AgriMarket*\n\n1. 💰 Sell my produce\n2. 🛍 Buy farm produce\n3. 📊 Current prices\n\nReply with a number:`
    }
    if (choice === 3) {
      return `📈 *Market Prices*\n\n• Maize: K680/bag\n• Tomatoes: K45/crate\n• Chicken: K120/bird\n• Beans: K320/bag\n\nPrices updated daily.\nType *menu* to go back.`
    }
    if (choice === 4) {
      await updateConversation(phone, { state: 'GOV_SERVICES' })
      return `🏛 *Government Services*\n\n1. 🪪 NRC Application\n2. 🏢 Business Registration\n3. 📋 NAPSA Queries\n4. 💼 ZRA / Tax\n5. 🏘 Council Permits\n\nReply with a number:`
    }
    if (choice === 5) {
      await updateConversation(phone, { state: 'SME_REGISTER' })
      return `🏪 *Register on Peza*\n\n✅ Free for 3 months\n✅ No website needed\n✅ Airtel Money payments\n\nWhat is your *business name*?`
    }
    if (choice === 6) {
      return `📦 *Order Tracking*\n\nShare your order ID to track it.\n\nExample: *PEZA-ABC123*\n\nOr type *menu* to go back.`
    }
  }

  if (state === 'BROWSE_CATEGORY') {
    const cats: Record<string, string> = {
      '1':'food','2':'fashion','3':'agriculture','4':'hardware','5':'beauty','6':'retail'
    }
    const cat = cats[msg]
    if (cat) {
      const { data: businesses } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('status', 'active')
        .eq('category', cat)
        .limit(6)

      if (!businesses?.length) {
        await updateConversation(phone, { state: 'MAIN_MENU' })
        return `No businesses in that category yet 😔\n\nType *5* to register yours!\nType *menu* to go back.`
      }

      await updateConversation(phone, { state: 'BROWSE_PRODUCTS', current_business_id: businesses[0].id })
      const list = businesses.map((b, i) => `${i+1}. *${b.name}*`).join('\n')
      return `🛍 *Available Businesses*\n\n${list}\n\nReply with a number to browse:`
    }
  }

  if (state === 'GOV_SERVICES') {
    const services: Record<string, string> = {
      '1': `🪪 *NRC Application*\n\nYou need:\n• Birth certificate\n• Parents NRC copies\n• 2 passport photos\n• Fee: K30\n\nVisit nearest NRDC office.\nType *menu* to go back.`,
      '2': `🏢 *Business Registration*\n\nPACRA registration:\n• Sole Trader: K850\n• Company: K2,500\n\nVisit pacra.org.zm\nType *menu* to go back.`,
      '3': `📋 *NAPSA Queries*\n\nCall: 0800 100 222 (free)\nOnline: my.napsa.org.zm\nOffice: NAPSA House, Lusaka\n\nType *menu* to go back.`,
      '4': `💼 *ZRA / Tax*\n\nTaxpayer Portal: zra.org.zm\nCall Centre: 4500\nVAT threshold: K800,000\n\nType *menu* to go back.`,
      '5': `🏘 *Council Permits*\n\nBusiness permit: K500-K2,000\nHealth permit: K200\n\nContact: Lusaka City Council\nlcc.org.zm\n\nType *menu* to go back.`
    }
    const service = services[msg]
    if (service) {
      await updateConversation(phone, { state: 'MAIN_MENU' })
      return service
    }
  }

  if (state === 'SME_REGISTER') {
    await supabase.from('businesses').upsert({
      name: msgRaw,
      whatsapp_number: phone,
      category: 'general',
      status: 'pending'
    }, { onConflict: 'whatsapp_number' })
    await updateConversation(phone, { state: 'MAIN_MENU' })
    return `🎉 *${msgRaw}* registered on Peza!\n\nOur team will WhatsApp you within 24hrs to:\n✅ Set up your catalogue\n✅ Connect Airtel Money\n✅ Give you your dashboard\n\nZikomo! 🙏`
  }

  if (state === 'AGRI_MENU') {
    if (msg === '1') {
      await updateConversation(phone, { state: 'AGRI_SELL' })
      return `🌾 *Sell Your Produce*\n\nTell me what you're selling:\n• Crop type\n• Quantity (bags/kg)\n• Your location\n\nExample: *"80 bags maize, Mkushi"*`
    }
    if (msg === '2') {
      await updateConversation(phone, { state: 'MAIN_MENU' })
      return `🛍 *Buy Produce*\n\nWhat are you looking for?\n\nExample: *"Maize in Lusaka"*\n\nType your request:`
    }
    if (msg === '3') {
      await updateConversation(phone, { state: 'MAIN_MENU' })
      return `📊 *AgriMarket Prices*\n\n• Maize: K680/bag\n• Soya beans: K850/bag\n• Groundnuts: K420/bag\n• Sunflower: K380/bag\n• Cassava: K180/bag\n\nType *menu* to go back.`
    }
  }

  if (state === 'AGRI_SELL') {
    await updateConversation(phone, { state: 'MAIN_MENU' })
    const aiReply = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 200,
      system: PEZA_SYSTEM + '\nA farmer wants to sell produce. Give them a helpful response with estimated price and next steps.',
      messages: [{ role: 'user', content: msgRaw }]
    })
    return (aiReply.content[0] as {type: string; text: string}).text + '\n\nType *menu* to go back.'
  }

  // Default — AI handles unknown input
  const aiReply = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    system: PEZA_SYSTEM + `\nUser state: ${state}. Be helpful and suggest typing *menu* to see options.`,
    messages: [{ role: 'user', content: msgRaw }]
  })
  return (aiReply.content[0] as {type: string; text: string}).text
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const message = formData.get('Body') as string
    const from = formData.get('From') as string
    const phone = from?.replace('whatsapp:', '') || ''

    console.log(`📱 [${phone}] ${message}`)

    const reply = await handleMessage(phone, message || '')

    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</Message>
</Response>`

    return new NextResponse(twimlResponse, {
      headers: { 'Content-Type': 'text/xml' }
    })
  } catch (error) {
    console.error('Webhook error:', error)
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Sorry, something went wrong! 😅 Type *menu* to restart.</Message>
</Response>`
    return new NextResponse(errorTwiml, {
      headers: { 'Content-Type': 'text/xml' }
    })
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Peza WhatsApp Bot is running 🚀',
    version: '1.0.0'
  })
}