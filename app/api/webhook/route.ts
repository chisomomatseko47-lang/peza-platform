import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY!
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL!
const INFOBIP_WHATSAPP_NUMBER = process.env.INFOBIP_WHATSAPP_NUMBER!

const PEZA_SYSTEM = `You are Peza, Zambia's WhatsApp commerce assistant. 
Be warm, friendly and proudly Zambian. Use occasional Nyanja greetings like Mwabonwa.
Keep responses SHORT — under 300 characters when possible.
Use emojis naturally. Currency is Zambian Kwacha (K).
Always suggest typing menu to see options.`

async function sendWhatsApp(to: string, message: string) {
  const response = await fetch(`https://${INFOBIP_BASE_URL}/whatsapp/1/message/text`, {
    method: 'POST',
    headers: {
      'Authorization': `App ${INFOBIP_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      from: INFOBIP_WHATSAPP_NUMBER,
      to: to,
      content: { text: message }
    })
  })
  const data = await response.json()
  console.log('Infobip response:', JSON.stringify(data))
  return data
}

async function getConv(phone: string) {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  let { data } = await db.from('conversations').select('*').eq('whatsapp_number', phone).single()
  if (!data) {
    const { data: n } = await db.from('conversations').insert({ whatsapp_number: phone, state: 'IDLE', cart: [] }).select().single()
    data = n
  }
  return data
}

async function saveConv(phone: string, updates: object) {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  await db.from('conversations').update({ ...updates, last_active: new Date().toISOString() }).eq('whatsapp_number', phone)
}

async function handle(phone: string, message: string): Promise<string> {
  const conv = await getConv(phone)
  const msg = message.trim().toLowerCase()
  const raw = message.trim()
  const state = conv?.state || 'IDLE'

  if (['hi','hello','mwabonwa','hey','start','0','menu'].includes(msg)) {
    await saveConv(phone, { state: 'MAIN_MENU', cart: [] })
    return `Mwabonwa! 👋 Welcome to *Peza* — Zambia's commerce platform.\n\n1️⃣ 🛒 Shop local businesses\n2️⃣ 🌾 AgriMarket\n3️⃣ 📈 Market prices\n4️⃣ 🏛 Government services\n5️⃣ 🏪 Register your business\n\nReply with a number!`
  }

  if (msg === 'help') {
    return `*Peza Help* 🆘\n\nType *menu* — main menu\nType *0* — start over\n\nEmail: hello@peza.africa\nWeb: peza.africa`
  }

  if (state === 'MAIN_MENU' || state === 'IDLE') {
    if (msg === '1') { await saveConv(phone, { state: 'BROWSE' }); return `🛒 *Shop by Category*\n\n1. 🍅 Food & Groceries\n2. 👗 Fashion\n3. 🌾 Agriculture\n4. 🔧 Hardware\n5. 💄 Beauty\n\nReply with a number:` }
    if (msg === '2') { await saveConv(phone, { state: 'AGRI' }); return `🌾 *AgriMarket*\n\n1. 💰 Sell my produce\n2. 🛍 Buy farm produce\n3. 📊 Current prices\n\nReply with a number:` }
    if (msg === '3') { return `📈 *Market Prices*\n\n• Maize: K680/bag\n• Tomatoes: K45/crate\n• Chicken: K120/bird\n• Beans: K320/bag\n\nType *menu* to go back.` }
    if (msg === '4') { await saveConv(phone, { state: 'GOV' }); return `🏛 *Government Services*\n\n1. 🪪 NRC\n2. 🏢 PACRA Registration\n3. 📋 NAPSA\n4. 💼 ZRA / Tax\n5. 🏘 Council Permits\n\nReply with a number:` }
    if (msg === '5') { await saveConv(phone, { state: 'REG' }); return `🏪 *Register on Peza*\n\n✅ Free for 3 months\n✅ No website needed\n✅ Airtel Money payments\n\nWhat is your *business name*?` }
  }

  if (state === 'GOV') {
    const s: Record<string,string> = {
      '1': `🪪 *NRC*\n\nBring: birth cert, parents NRC, 2 photos\nFee: K30\nVisit nearest NRDC office.\n\nType *menu* to go back.`,
      '2': `🏢 *PACRA*\n\nSole Trader: K850\nCompany: K2,500\npacra.org.zm\n\nType *menu* to go back.`,
      '3': `📋 *NAPSA*\n\nCall: 0800 100 222 (free)\nmy.napsa.org.zm\n\nType *menu* to go back.`,
      '4': `💼 *ZRA*\n\nPortal: zra.org.zm\nCall: 4500\nVAT threshold: K800,000\n\nType *menu* to go back.`,
      '5': `🏘 *Council Permits*\n\nBusiness: K500-K2,000\nHealth: K200\nlcc.org.zm\n\nType *menu* to go back.`
    }
    if (s[msg]) { await saveConv(phone, { state: 'MAIN_MENU' }); return s[msg] }
  }

  if (state === 'REG') {
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    await db.from('businesses').upsert({ name: raw, whatsapp_number: phone, category: 'general', status: 'pending' }, { onConflict: 'whatsapp_number' })
    await saveConv(phone, { state: 'MAIN_MENU' })
    return `🎉 *${raw}* registered on Peza!\n\nOur team will WhatsApp you within 24hrs to set up your store.\n\nZikomo! 🙏\n\nType *menu* to go back.`
  }

  if (state === 'AGRI') {
    if (msg === '1') { await saveConv(phone, { state: 'SELL' }); return `🌾 What are you selling?\n\nTell me:\n• Crop type\n• Quantity\n• Location\n\nExample: *80 bags maize, Mkushi*` }
    if (msg === '2') { await saveConv(phone, { state: 'MAIN_MENU' }); return `🛍 What are you looking for?\n\nExample: *Maize in Lusaka*` }
    if (msg === '3') { await saveConv(phone, { state: 'MAIN_MENU' }); return `📊 *AgriMarket Prices*\n\n• Maize: K680/bag\n• Soya: K850/bag\n• Groundnuts: K420/bag\n• Cassava: K180/bag\n\nType *menu* to go back.` }
  }

  if (state === 'SELL') {
    await saveConv(phone, { state: 'MAIN_MENU' })
    const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await ai.messages.create({
      model: 'claude-haiku-4-5', max_tokens: 150,
      system: PEZA_SYSTEM + ' A Zambian farmer wants to sell produce. Give a helpful short response with price estimate in Kwacha.',
      messages: [{ role: 'user', content: raw }]
    })
    return (res.content[0] as {type:string;text:string}).text + '\n\nType *menu* to go back.'
  }

  // AI fallback
  const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
  const res = await ai.messages.create({
    model: 'claude-haiku-4-5', max_tokens: 150,
    system: PEZA_SYSTEM + ` User state: ${state}. Suggest typing menu.`,
    messages: [{ role: 'user', content: raw }]
  })
  return (res.content[0] as {type:string;text:string}).text
}

// Infobip sends webhooks as JSON POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Infobip webhook:', JSON.stringify(body))

    // Infobip WhatsApp webhook structure
    const results = body?.results || []
    
    for (const result of results) {
      const from = result?.from
      const message = result?.message?.text || result?.message?.body || ''
      
      if (!from || !message) continue
      
      console.log(`📱 [${from}] ${message}`)
      const reply = await handle(from, message)
      await sendWhatsApp(from, reply)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Peza Infobip webhook running 🚀', version: '2.0.0' })
}
