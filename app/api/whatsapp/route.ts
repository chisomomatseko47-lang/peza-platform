import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const maxDuration = 60

// ── Env ───────────────────────────────────────────────────────────────────────
const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY!
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL!
const INFOBIP_FROM = process.env.INFOBIP_WHATSAPP_NUMBER!

// ── Supabase ──────────────────────────────────────────────────────────────────
function db() {
      return createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
}

// ── Send WhatsApp message via Infobip ─────────────────────────────────────────
async function send(to: string, text: string): Promise<void> {
      try {
              const url = `https://${INFOBIP_BASE_URL}/whatsapp/1/message/text`
              const body = { from: INFOBIP_FROM, to, content: { text } }
              console.log(`[SEND] To: ${to} | Msg: ${text.substring(0, 80)}`)
              const res = await fetch(url, {
                        method: 'POST',
                        headers: {
                                    'Authorization': `App ${INFOBIP_API_KEY}`,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                        },
                        body: JSON.stringify(body)
              })
              const data = await res.json()
              const status = data?.messages?.[0]?.status?.name || 'unknown'
              console.log(`[SEND] Result: ${status} | HTTP: ${res.status}`)
              if (!res.ok) console.error(`[SEND] ERROR:`, JSON.stringify(data))
      } catch (err) {
              console.error('[SEND] Exception:', err)
      }
}

// ── Get or create conversation ─────────────────────────────────────────────────
// DB columns: whatsapp_number, state, context, cart, last_active, customer_name
async function getConv(phone: string) {
      const supabase = db()
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('whatsapp_number', phone)
        .single()

  if (error && error.code !== 'PGRST116') {
          console.error('[DB] getConv error:', error.message)
  }

  if (!data) {
          const { data: newConv, error: insertErr } = await supabase
            .from('conversations')
            .insert({
                        whatsapp_number: phone,
                        state: 'WELCOME',
                        context: {},
                        cart: []
            })
            .select()
            .single()
          if (insertErr) console.error('[DB] insert error:', insertErr.message)
          return newConv
  }
      return data
}

// ── Update conversation ────────────────────────────────────────────────────────
async function updateConv(phone: string, updates: Record<string, unknown>) {
      const supabase = db()
      const { error } = await supabase
        .from('conversations')
        .update({ ...updates, last_active: new Date().toISOString() })
        .eq('whatsapp_number', phone)
      if (error) console.error('[DB] updateConv error:', error.message)
}

// ── MENUS ─────────────────────────────────────────────────────────────────────
const MAIN_MENU = `🛒 *PEZA* — Zambia's Commerce Platform

Reply with a number:
1️⃣ Shop & Order
2️⃣ AgriMarket
3️⃣ Book Freight
4️⃣ Market Prices
5️⃣ Gov Services
6️⃣ Sell on Peza ⭐
7️⃣ My Account

Type *menu* anytime to return here.`

const SELL_MENU = `🏪 *Sell on Peza*

Start earning today! We'll set up your store in 5 easy steps.

Reply:
1️⃣ Register my business
2️⃣ I already have a store
0️⃣ Back to main menu`

const CATEGORY_MENU = `📦 Select your business category:

1️⃣ Food & Groceries
2️⃣ Electronics & Phones
3️⃣ Clothing & Fashion
4️⃣ Hardware & Building
5️⃣ AgriProduce & Farming
6️⃣ Services & Skills
7️⃣ Health & Beauty
8️⃣ Other

Reply with a number:`

// ── SELLER REGISTRATION FLOW ───────────────────────────────────────────────────
async function handleSellerFlow(phone: string, state: string, msg: string, context: Record<string, unknown>): Promise<void> {
      const t = msg.trim()

  if (state === 'SELL_MENU') {
          if (t === '1') {
                    await updateConv(phone, { state: 'REG_NAME', context })
                    await send(phone, `🏪 *Step 1 of 5 — Business Name*\n\nWhat is the name of your business?\n\nExample: "Grace Grocery Store"\n\nType 0 to go back.`)
          } else if (t === '2') {
                    await updateConv(phone, { state: 'WELCOME', context: {} })
                    await send(phone, `Welcome back! Your store is active. 🎉\n\nType *menu* to see all options.`)
          } else if (t === '0') {
                    await updateConv(phone, { state: 'WELCOME', context: {} })
                    await send(phone, MAIN_MENU)
          } else {
                    await send(phone, SELL_MENU)
          }
          return
  }

  if (state === 'REG_NAME') {
          if (t === '0') {
                    await updateConv(phone, { state: 'SELL_MENU', context: {} })
                    await send(phone, SELL_MENU)
                    return
          }
          if (t.length < 2) {
                    await send(phone, `Please enter a valid business name.\n\nWhat is your business name?`)
                    return
          }
          await updateConv(phone, { state: 'REG_CATEGORY', context: { ...context, business_name: t } })
          await send(phone, `✅ *"${t}"* — great name!\n\n` + CATEGORY_MENU)
          return
  }

  if (state === 'REG_CATEGORY') {
          if (t === '0') {
                    await updateConv(phone, { state: 'REG_NAME', context })
                    await send(phone, `🏪 *Step 1 of 5 — Business Name*\n\nWhat is your business name?`)
                    return
          }
          const cats: Record<string, string> = {
                    '1': 'Food & Groceries', '2': 'Electronics & Phones', '3': 'Clothing & Fashion',
                    '4': 'Hardware & Building', '5': 'AgriProduce & Farming',
                    '6': 'Services & Skills', '7': 'Health & Beauty', '8': 'Other'
          }
          const cat = cats[t]
          if (!cat) {
                    await send(phone, `Please reply with a number 1-8.\n\n` + CATEGORY_MENU)
                    return
          }
          await updateConv(phone, { state: 'REG_LOCATION', context: { ...context, category: cat } })
          await send(phone, `✅ Category: *${cat}*\n\n📍 *Step 3 of 5 — Location*\n\nWhich town/city is your business in?\n\nExample: Lusaka, Kitwe, Ndola\n\nType 0 to go back.`)
          return
  }

  if (state === 'REG_LOCATION') {
          if (t === '0') {
                    await updateConv(phone, { state: 'REG_CATEGORY', context })
                    await send(phone, CATEGORY_MENU)
                    return
          }
          if (t.length < 2) {
                    await send(phone, `Please enter your town or city name.`)
                    return
          }
          await updateConv(phone, { state: 'REG_AIRTEL', context: { ...context, location: t } })
          await send(phone, `✅ Location: *${t}*\n\n💰 *Step 4 of 5 — Airtel Money*\n\nEnter your Airtel Money number for receiving payments.\n\nFormat: 0971234567\n\nType 0 to skip.`)
          return
  }

  if (state === 'REG_AIRTEL') {
          const airtel = t === '0' ? 'Not provided' : t
          await updateConv(phone, { state: 'REG_PRODUCT', context: { ...context, airtel_money: airtel } })
          await send(phone, `✅ Payment details saved!\n\n📦 *Step 5 of 5 — First Product*\n\nAdd your first product in this format:\n\n*Name | Price | Description*\n\nExample:\n"Tomatoes | K25 | Fresh 1kg bag"\n\nType 0 to skip and finish.`)
          return
  }

  if (state === 'REG_PRODUCT') {
          const ctx = context as Record<string, string>
          const supabase = db()

        if (t !== '0') {
                  const { data: biz, error: bizErr } = await supabase
                    .from('businesses')
                    .insert({
                                  name: ctx.business_name || 'My Business',
                                  category: ctx.category || 'Other',
                                  location: ctx.location || 'Zambia',
                                  owner_phone: phone,
                                  airtel_money_number: ctx.airtel_money || '',
                                  is_active: true,
                                  description: `${ctx.business_name} — ${ctx.category} in ${ctx.location}`
                    })
                    .select()
                    .single()

            if (bizErr) {
                        console.error('[DB] Business insert error:', bizErr.message)
            }

            if (biz && t.includes('|')) {
                        const parts = t.split('|').map((p: string) => p.trim())
                        if (parts.length >= 2) {
                                      await supabase.from('products').insert({
                                                      business_id: biz.id,
                                                      name: parts[0],
                                                      price: parseFloat(parts[1].replace(/[^0-9.]/g, '')) || 0,
                                                      description: parts[2] || '',
                                                      is_available: true
                                      })
                        }
            }
        }

        await updateConv(phone, { state: 'WELCOME', context: {} })
          await send(phone, `🎉 *Congratulations! Your Peza store is LIVE!*

          ✅ Business: *${ctx.business_name || 'Your Business'}*
          ✅ Category: *${ctx.category || 'General'}*
          ✅ Location: *${ctx.location || 'Zambia'}*

          Your store is now visible to thousands of Zambian buyers! 🛒

          Type *store* to manage your store.
          Type *menu* for the main menu.

          *Zikomo!* 🇿🇲`)
          return
  }

  // Fallback
  await updateConv(phone, { state: 'WELCOME', context: {} })
      await send(phone, MAIN_MENU)
}

// ── MAIN POST HANDLER ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
      try {
              const raw = await req.json()
              console.log('[WEBHOOK] Received:', JSON.stringify(raw).substring(0, 600))

        // Infobip sends: { results: [{ from, to, message: { text } }] }
        const results = raw?.results ?? []

                if (!Array.isArray(results) || results.length === 0) {
                          console.log('[WEBHOOK] No results in payload, checking raw...')
                          // Sometimes Infobip sends directly without results wrapper
                if (raw?.from && raw?.message) {
                            results.push(raw)
                } else {
                            return NextResponse.json({ status: 'ok', note: 'no messages' })
                }
                }

        for (const result of results) {
                  const userPhone: string = String(result.from || result.sender || '').trim()
                  const msgText: string = String(
                              result.message?.text || result.text || result.content?.text || ''
                            ).trim()

                if (!userPhone || !msgText) {
                            console.log('[WEBHOOK] Skipping: missing phone or message')
                            console.log('[WEBHOOK] Result dump:', JSON.stringify(result))
                            continue
                }

                console.log(`[WEBHOOK] Phone: ${userPhone} | Msg: "${msgText}"`)

                const msgLower = msgText.toLowerCase().trim()

                // Get conversation state from DB
                const conv = await getConv(userPhone)
                  const state: string = String(conv?.state || 'WELCOME')
                  const context = (conv?.context as Record<string, unknown>) || {}

                            console.log(`[WEBHOOK] State: ${state}`)

                // Global commands (work from any state)
                if (['menu', 'hi', 'hello', 'start', 'peza', 'helo'].includes(msgLower)) {
                            await updateConv(userPhone, { state: 'WELCOME', context: {} })
                            await send(userPhone, MAIN_MENU)
                            continue
                }

                // Route by state
                if (state === 'WELCOME' || state === 'MAIN_MENU') {
                            switch (msgLower) {
                                case '1':
                                                await updateConv(userPhone, { state: 'SHOP' })
                                                await send(userPhone, `🛍️ *Shop & Order*\n\nBrowse products from Zambian businesses!\n\nFull marketplace coming soon.\n\nFor now, type a product name to search.\n\nType 0 for main menu.`)
                                                break
                                case '2':
                                                await updateConv(userPhone, { state: 'AGRI' })
                                                await send(userPhone, `🌾 *AgriMarket*\n\nConnect farmers to buyers directly!\n\n1️⃣ List my produce\n2️⃣ Find produce\n0️⃣ Main menu`)
                                                break
                                case '3':
                                                await updateConv(userPhone, { state: 'FREIGHT' })
                                                await send(userPhone, `🚛 *Book Freight*\n\nTransport goods across Zambia!\n\nDescribe what you need to move and where.\n\nType 0 for main menu.`)
                                                break
                                case '4':
                                                await updateConv(userPhone, { state: 'PRICES' })
                                                await send(userPhone, `📊 *Market Prices (Lusaka — Today)*\n\n🌽 Maize 50kg: K180–K220\n🍅 Tomatoes box: K80–K120\n🥕 Carrots kg: K15–K25\n🧅 Onions kg: K12–K20\n🌻 Sunflower 50kg: K150–K180\n🥚 Eggs (30): K45–K60\n\nType 0 for main menu.`)
                                                break
                                case '5':
                                                await updateConv(userPhone, { state: 'GOV' })
                                                await send(userPhone, `🏛️ *Government Services*\n\n1️⃣ NRC Application\n2️⃣ NAPSA Inquiry\n3️⃣ ZRA Tax Services\n4️⃣ PACRA Registration\n5️⃣ Council Permits\n0️⃣ Back to main menu`)
                                                break
                                case '6':
                                                await updateConv(userPhone, { state: 'SELL_MENU', context: {} })
                                                await send(userPhone, SELL_MENU)
                                                break
                                case '7':
                                                await updateConv(userPhone, { state: 'ACCOUNT' })
                                                await send(userPhone, `👤 *My Account*\n\n📱 Phone: ${userPhone}\n\n1️⃣ My Orders\n2️⃣ My Store\n3️⃣ Settings\n0️⃣ Main menu`)
                                                break
                                default:
                                                await send(userPhone, MAIN_MENU)
                            }
                } else if (['SELL_MENU', 'REG_NAME', 'REG_CATEGORY', 'REG_LOCATION', 'REG_AIRTEL', 'REG_PRODUCT'].includes(state)) {
                            await handleSellerFlow(userPhone, state, msgText, context)
                } else if (state === 'GOV') {
                            const govInfo: Record<string, string> = {
                                          '1': `📋 *NRC Application*\n\nVisit nearest Immigration office.\nBring: Birth certificate + guardian ID\nFee: K100\n\nOffices: Lusaka (Independence Ave), Kitwe, Ndola\n\nType 0 to go back.`,
                                          '2': `📋 *NAPSA*\n\nCheck balance:\n• SMS "NAPSA" to 5678\n• napsa.co.zm\n• Call: 0800-172-772 (free)\n\nType 0 to go back.`,
                                          '3': `📋 *ZRA Tax*\n\n• Online: taxonline.zra.org.zm\n• TIN: Any ZRA office\n• Call: 4040 (free)\n\nType 0 to go back.`,
                                          '4': `📋 *PACRA Registration*\n\n• Online: pacra.org.zm\n• Cost: From K400\n• Takes 1-3 days\n• +260 211 224 256\n\nType 0 to go back.`,
                                          '5': `📋 *Council Permits*\n\nVisit your nearest city council.\nBring: NRC + business address\n\nLusaka: Cairo Rd\nKitwe: Freedom Ave\n\nType 0 to go back.`
                            }
                            if (msgLower === '0') {
                                          await updateConv(userPhone, { state: 'WELCOME' })
                                          await send(userPhone, MAIN_MENU)
                            } else if (govInfo[msgLower]) {
                                          await send(userPhone, govInfo[msgLower])
                            } else {
                                          await send(userPhone, `🏛️ *Government Services*\n\n1️⃣ NRC\n2️⃣ NAPSA\n3️⃣ ZRA\n4️⃣ PACRA\n5️⃣ Council Permits\n0️⃣ Main menu`)
                            }
                } else {
                            // Unknown state — reset
                    console.log(`[WEBHOOK] Unknown state "${state}" — resetting to WELCOME`)
                            await updateConv(userPhone, { state: 'WELCOME', context: {} })
                            await send(userPhone, MAIN_MENU)
                }
        }

        return NextResponse.json({ status: 'ok' })
      } catch (err) {
              console.error('[WEBHOOK] Fatal error:', err)
              return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      }
}

export async function GET() {
      return NextResponse.json({ status: 'Peza WhatsApp Bot v4.1 — Live 🚀', db: 'whatsapp_number + state columns' })
}
