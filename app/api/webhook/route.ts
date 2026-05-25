import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

export async function GET() {
  return NextResponse.json({ status: 'Peza running', version: '1.0.0' })
}

export async function POST(request: NextRequest) {
  try {
    const fd = await request.formData()
    const message = fd.get('Body') as string
    const from = fd.get('From') as string
    const phone = from?.replace('whatsapp:', '') || ''
    
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    let { data: conv } = await db.from('conversations').select('*').eq('whatsapp_number', phone).single()
    if (!conv) {
      const { data: n } = await db.from('conversations').insert({ whatsapp_number: phone, state: 'IDLE', cart: [] }).select().single()
      conv = n
    }
    
    const msg = (message || '').trim().toLowerCase()
    const raw = (message || '').trim()
    const state = conv?.state || 'IDLE'
    let reply = ''
    
    if (['hi','hello','mwabonwa','hey','start','0','menu'].includes(msg)) {
      await db.from('conversations').update({ state: 'MAIN_MENU', cart: [] }).eq('whatsapp_number', phone)
      reply = 'Mwabonwa! Welcome to Peza.\n\n1 Shop local businesses\n2 AgriMarket\n3 Market prices\n4 Government services\n5 Register your business\n\nReply with a number!'
    } else if (state === 'MAIN_MENU' || state === 'IDLE') {
      if (msg === '1') { await db.from('conversations').update({ state: 'BROWSE' }).eq('whatsapp_number', phone); reply = 'Shop by Category\n\n1 Food\n2 Fashion\n3 Agriculture\n4 Hardware\n5 Beauty\n\nReply with a number:' }
      else if (msg === '2') { await db.from('conversations').update({ state: 'AGRI' }).eq('whatsapp_number', phone); reply = 'AgriMarket\n\n1 Sell produce\n2 Buy produce\n3 Current prices\n\nReply with a number:' }
      else if (msg === '3') { reply = 'Market Prices\n\nMaize K680 per bag\nTomatoes K45 per crate\nChicken K120 per bird\n\nType menu to go back.' }
      else if (msg === '4') { await db.from('conversations').update({ state: 'GOV' }).eq('whatsapp_number', phone); reply = 'Government Services\n\n1 NRC\n2 Business Registration\n3 NAPSA\n4 ZRA Tax\n5 Council Permits\n\nReply with a number:' }
      else if (msg === '5') { await db.from('conversations').update({ state: 'REG' }).eq('whatsapp_number', phone); reply = 'Register on Peza - free for 3 months!\n\nWhat is your business name?' }
      else {
        const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
        const res = await ai.messages.create({ model: 'claude-haiku-4-5', max_tokens: 150, system: 'You are Peza, Zambia WhatsApp commerce assistant. Be brief and suggest typing menu.', messages: [{ role: 'user', content: raw }] })
        reply = (res.content[0] as { type: string; text: string }).text
      }
    } else if (state === 'REG') {
      await db.from('businesses').upsert({ name: raw, whatsapp_number: phone, category: 'general', status: 'pending' }, { onConflict: 'whatsapp_number' })
      await db.from('conversations').update({ state: 'MAIN_MENU' }).eq('whatsapp_number', phone)
      reply = raw + ' registered! Our team will WhatsApp you within 24hrs. Zikomo! Type menu to go back.'
    } else if (state === 'GOV') {
      const services: Record<string, string> = {
        '1': 'NRC: Bring birth certificate, parents NRC, 2 photos. Fee K30. Visit NRDC office.',
        '2': 'PACRA: Sole Trader K850, Company K2500. Visit pacra.org.zm',
        '3': 'NAPSA: Call 0800 100 222 free. my.napsa.org.zm',
        '4': 'ZRA: zra.org.zm Call 4500. VAT threshold K800000.',
        '5': 'Council Permits: Business K500-K2000, Health K200. lcc.org.zm'
      }
      reply = services[msg] ? services[msg] + '\n\nType menu to go back.' : 'Please reply with 1-5 or type menu.'
      await db.from('conversations').update({ state: 'MAIN_MENU' }).eq('whatsapp_number', phone)
    } else if (state === 'AGRI') {
      if (msg === '1') { await db.from('conversations').update({ state: 'SELL' }).eq('whatsapp_number', phone); reply = 'Tell me: crop type, quantity, location. Example: 80 bags maize Mkushi' }
      else if (msg === '2') { reply = 'What are you looking for? Example: Maize in Lusaka'; await db.from('conversations').update({ state: 'MAIN_MENU' }).eq('whatsapp_number', phone) }
      else if (msg === '3') { reply = 'Prices: Maize K680, Soya K850, Groundnuts K420, Cassava K180 per bag. Type menu to go back.'; await db.from('conversations').update({ state: 'MAIN_MENU' }).eq('whatsapp_number', phone) }
      else reply = 'Reply with 1, 2, or 3. Type menu to go back.'
    } else if (state === 'SELL') {
      const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
      const res = await ai.messages.create({ model: 'claude-haiku-4-5', max_tokens: 150, system: 'You are Peza Zambia commerce assistant. A farmer wants to sell produce. Give short helpful response with price estimate in Kwacha.', messages: [{ role: 'user', content: raw }] })
      reply = (res.content[0] as { type: string; text: string }).text + ' Type menu to go back.'
      await db.from('conversations').update({ state: 'MAIN_MENU' }).eq('whatsapp_number', phone)
    } else {
      const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
      const res = await ai.messages.create({ model: 'claude-haiku-4-5', max_tokens: 150, system: 'You are Peza Zambia WhatsApp commerce assistant. Be brief. Suggest typing menu.', messages: [{ role: 'user', content: raw }] })
      reply = (res.content[0] as { type: string; text: string }).text
    }
    
    const xml = '<?xml version="1.0" encoding="UTF-8"?><Response><Message>' + reply.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</Message></Response>'
    return new NextResponse(xml, { headers: { 'Content-Type': 'text/xml' } })
  } catch (err) {
    console.error(err)
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry something went wrong. Type menu to restart.</Message></Response>', { headers: { 'Content-Type': 'text/xml' } })
  }
}
