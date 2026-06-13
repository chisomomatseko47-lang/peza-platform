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
          const body = {
                  from: INFOBIP_FROM,
                  to: to,
                  content: { text }
          }
          console.log(`📤 Sending to ${to}:`, text.substring(0, 80))
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
          console.log(`✅ Infobip response:`, JSON.stringify(data).substring(0, 200))
          if (!res.ok) {
                  console.error(`❌ Infobip error ${res.status}:`, JSON.stringify(data))
          }
    } catch (err) {
          console.error('❌ send() error:', err)
    }
}

// ── Get or create conversation ────────────────────────────────────────────────
async function getConv(phone: string) {
    const supabase = db()
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('phone_number', phone)
      .single()

  if (error && error.code !== 'PGRST116') {
        console.error('DB getConv error:', error)
  }

  if (!data) {
        const { data: newConv, error: insertErr } = await supabase
          .from('conversations')
          .insert({
                    phone_number: phone,
                    step: 'WELCOME',
                    context: {},
                    cart: []
          })
          .select()
          .single()

      if (insertErr) console.error('DB insert error:', insertErr)
        return newConv
  }
    return data
}

// ── Update conversation step/context ─────────────────────────────────────────
async function updateConv(phone: string, updates: Record<string, unknown>) {
    const supabase = db()
    const { error } = await supabase
      .from('conversations')
      .update({ ...updates, last_active: new Date().toISOString() })
      .eq('phone_number', phone)

  if (error) console.error('DB updateConv error:', error)
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

const GOV_MENU = `🏛️ *Government Services*

1️⃣ NRC Application
2️⃣ NAPSA Inquiry
3️⃣ ZRA Tax Services
4️⃣ PACRA Registration
5️⃣ Council Permits
0️⃣ Back to main menu`

// ── HANDLE SELLER REGISTRATION ────────────────────────────────────────────────
async function handleSellerFlow(phone: string, step: string, msg: string, context: Record<string, unknown>): Promise<void> {
    const trimmed = msg.trim()

  switch (step) {
    case 'SELL_MENU':
            if (trimmed === '1') {
                      await updateConv(phone, { step: 'REG_NAME', context })
                      await send(phone, `🏪 *Step 1 of 5 — Business Name*\n\nWhat is the name of your business?\n\nExample: "Grace Grocery Store"\n\nType 0 to go back.`)
            } else if (trimmed === '2') {
                      await updateConv(phone, { step: 'WELCOME', context: {} })
                      await send(phone, `Welcome back! Your store is registered with Peza. 🎉\n\nType *menu* to see all options.`)
            } else if (trimmed === '0') {
                      await updateConv(phone, { step: 'WELCOME', context: {} })
                      await send(phone, MAIN_MENU)
            } else {
                      await send(phone, SELL_MENU)
            }
            break

    case 'REG_NAME':
            if (trimmed === '0') {
                      await updateConv(phone, { step: 'SELL_MENU', context: {} })
                      await send(phone, SELL_MENU)
                      return
            }
            if (trimmed.length < 2) {
                      await send(phone, `Please enter a valid business name (at least 2 characters).\n\nWhat is your business name?`)
                      return
            }
            await updateConv(phone, { step: 'REG_CATEGORY', context: { ...context, business_name: trimmed } })
            await send(phone, `✅ *"${trimmed}"* — great name!\n\n` + CATEGORY_MENU)
            break

    case 'REG_CATEGORY': {
            if (trimmed === '0') {
                      await updateConv(phone, { step: 'REG_NAME', context })
                      await send(phone, `🏪 *Step 1 of 5 — Business Name*\n\nWhat is the name of your business?`)
                      return
            }
            const cats: Record<string, string> = {
                      '1': 'Food & Groceries', '2': 'Electronics & Phones', '3': 'Clothing & Fashion',
                      '4': 'Hardware & Building', '5': 'AgriProduce & Farming',
                      '6': 'Services & Skills', '7': 'Health & Beauty', '8': 'Other'
            }
            const cat = cats[trimmed]
            if (!cat) {
                      await send(phone, `Please reply with a number 1-8 to select your category.\n\n` + CATEGORY_MENU)
                      return
            }
            await updateConv(phone, { step: 'REG_LOCATION', context: { ...context, category: cat } })
            await send(phone, `✅ Category: *${cat}*\n\n📍 *Step 3 of 5 — Location*\n\nWhich town/city is your business in?\n\nExample: Lusaka, Kitwe, Ndola, Livingstone\n\nType 0 to go back.`)
            break
    }

    case 'REG_LOCATION':
            if (trimmed === '0') {
                      await updateConv(phone, { step: 'REG_CATEGORY', context })
                      await send(phone, CATEGORY_MENU)
                      return
            }
            if (trimmed.length < 2) {
                      await send(phone, `Please enter your town/city name.\n\nExample: Lusaka`)
                      return
            }
            await updateConv(phone, { step: 'REG_AIRTEL', context: { ...context, location: trimmed } })
            await send(phone, `✅ Location: *${trimmed}*\n\n💰 *Step 4 of 5 — Airtel Money*\n\nEnter your Airtel Money number for receiving payments.\n\nFormat: 0971234567 or 260971234567\n\nType 0 to skip for now.`)
            break

    case 'REG_AIRTEL': {
            let airtel = trimmed
            if (airtel === '0') airtel = 'Not provided'
            await updateConv(phone, { step: 'REG_PRODUCT', context: { ...context, airtel_money: airtel } })
            await send(phone, `✅ Payment details saved!\n\n📦 *Step 5 of 5 — First Product*\n\nAdd your first product. Send it in this format:\n\n*Name | Price | Description*\n\nExample:\n"Tomatoes | K25 | Fresh tomatoes, 1kg bag"\n\nType 0 to skip and finish setup.`)
            break
    }

    case 'REG_PRODUCT': {
            const ctx = context as Record<string, string>
            if (trimmed !== '0' && trimmed.includes('|')) {
                      const parts = trimmed.split('|').map((p: string) => p.trim())
                      if (parts.length >= 2) {
                                  const supabase = db()
                                  // Save business
                        const { data: biz, error: bizErr } = await supabase
                                    .from('businesses')
                                    .insert({
                                                    name: ctx.business_name,
                                                    category: ctx.category,
                                                    location: ctx.location,
                                                    owner_phone: phone,
                                                    airtel_money_number: ctx.airtel_money,
                                                    is_active: true,
                                                    description: `${ctx.business_name} — ${ctx.category} in ${ctx.location}`
                                    })
                                    .select()
                                    .single()

                        if (bizErr) {
                                      console.error('Business save error:', bizErr)
                        }

                        if (biz) {
                                      await supabase.from('products').insert({
                                                      business_id: biz.id,
                                                      name: parts[0],
                                                      price: parseFloat(parts[1].replace(/[^0-9.]/g, '')) || 0,
                                                      description: parts[2] || '',
                                                      is_available: true
                                      })
                        }
                      }
            } else if (trimmed !== '0') {
                      // Save business without product
              const supabase = db()
                      await supabase.from('businesses').insert({
                                  name: ctx.business_name,
                                  category: ctx.category,
                                  location: ctx.location,
                                  owner_phone: phone,
                                  airtel_money_number: ctx.airtel_money || '',
                                  is_active: true,
                                  description: `${ctx.business_name} — ${ctx.category} in ${ctx.location}`
                      })
            }

            await updateConv(phone, { step: 'WELCOME', context: {} })
            await send(phone, `🎉 *Congratulations! Your Peza store is LIVE!*

            ✅ Business: *${(context as Record<string, string>).business_name}*
            ✅ Category: *${(context as Record<string, string>).category}*
            ✅ Location: *${(context as Record<string, string>).location}*

            Your store is now visible to thousands of Zambian buyers on Peza! 🛒

            To manage your store, type *store* anytime.
            Type *menu* to return to main menu.

            *Zikomo!* 🇿🇲`)
            break
    }

    default:
            await updateConv(phone, { step: 'WELCOME', context: {} })
            await send(phone, MAIN_MENU)
  }
}

// ── MAIN POST HANDLER ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
          const raw = await req.json()
          console.log('📨 Infobip webhook received:', JSON.stringify(raw).substring(0, 500))

      // Parse Infobip payload — handle both array and single result formats
      const results = raw?.results || (raw?.from ? [raw] : [])

      if (!results || results.length === 0) {
              console.log('⚠️ No results in payload')
              return NextResponse.json({ status: 'ok' })
      }

      for (const result of results) {
              // CRITICAL: In Infobip, 'from' is the USER's phone, 'to' is the Infobip number
            const userPhone = result.from || result.sender || ''
              const msgText = result.message?.text || result.text || result.content?.text || ''

            if (!userPhone || !msgText) {
                      console.log('⚠️ Missing phone or message. from:', userPhone, 'msg:', msgText)
                      console.log('Full result:', JSON.stringify(result))
                      continue
            }

            console.log(`📱 From: ${userPhone}, Message: "${msgText}"`)

            const msg = msgText.trim().toLowerCase()

            // Get conversation state
            const conv = await getConv(userPhone)
              const step = conv?.step || 'WELCOME'
              const context = (conv?.context as Record<string, unknown>) || {}

                      console.log(`🔄 Current step: ${step}`)

            // Global commands — work from any step
            if (msg === 'menu' || msg === 'hi' || msg === 'hello' || msg === 'start' || msg === 'peza') {
                      await updateConv(userPhone, { step: 'WELCOME', context: {} })
                      await send(userPhone, MAIN_MENU)
                      continue
            }

            if (msg === '0' && step === 'WELCOME') {
                      await send(userPhone, MAIN_MENU)
                      continue
            }

            // Route by current step
            if (step === 'WELCOME' || step === 'MAIN_MENU') {
                      switch (msg) {
                        case '1':
                                      await updateConv(userPhone, { step: 'SHOP' })
                                      await send(userPhone, `🛍️ *Shop & Order*\n\nBrowse businesses near you!\n\nComming soon — full marketplace.\n\nFor now, type a business name or product to search.\n\nType 0 for main menu.`)
                                      break
                        case '2':
                                      await updateConv(userPhone, { step: 'AGRI' })
                                      await send(userPhone, `🌾 *AgriMarket*\n\nConnect farmers to buyers directly — no middlemen!\n\n1️⃣ List my produce\n2️⃣ Find produce\n0️⃣ Main menu`)
                                      break
                        case '3':
                                      await updateConv(userPhone, { step: 'FREIGHT' })
                                      await send(userPhone, `🚛 *Book Freight*\n\nTransport goods across Zambia!\n\nTell us:\n• What you're moving\n• From where\n• To where\n\nOr type 0 for main menu.`)
                                      break
                        case '4':
                                      await updateConv(userPhone, { step: 'PRICES' })
                                      await send(userPhone, `📊 *Market Prices*\n\nToday's prices in Lusaka markets:\n\n🌽 Maize (50kg): K180–K220\n🍅 Tomatoes (box): K80–K120\n🥕 Carrots (kg): K15–K25\n🧅 Onions (kg): K12–K20\n🌻 Sunflower (50kg): K150–K180\n\nPrices updated daily.\nType 0 for main menu.`)
                                      break
                        case '5':
                                      await updateConv(userPhone, { step: 'GOV' })
                                      await send(userPhone, GOV_MENU)
                                      break
                        case '6':
                                      await updateConv(userPhone, { step: 'SELL_MENU', context: {} })
                                      await send(userPhone, SELL_MENU)
                                      break
                        case '7':
                                      await updateConv(userPhone, { step: 'ACCOUNT' })
                                      await send(userPhone, `👤 *My Account*\n\nYour Peza profile:\n\n📱 Phone: ${userPhone}\n\n1️⃣ My Orders\n2️⃣ My Store\n3️⃣ Settings\n0️⃣ Main menu`)
                                      break
                        default:
                                      await send(userPhone, MAIN_MENU)
                      }
            } else if (step.startsWith('REG_') || step === 'SELL_MENU') {
                      await handleSellerFlow(userPhone, step, msgText, context)
            } else if (step === 'GOV') {
                      if (msg === '0') {
                                  await updateConv(userPhone, { step: 'WELCOME' })
                                  await send(userPhone, MAIN_MENU)
                      } else {
                                  const govServices: Record<string, string> = {
                                                '1': `📋 *NRC Application*\n\nTo apply for NRC:\n1. Visit your nearest Immigration office\n2. Bring: Birth certificate, guardian ID\n3. Pay K100 fee\n\nOffices: Lusaka (Independence Ave), Kitwe, Ndola\n\nType 0 to go back.`,
                                                '2': `📋 *NAPSA Inquiry*\n\nTo check your NAPSA balance:\n• SMS "NAPSA" + ID to 5678\n• Visit napsa.co.zm\n• Call: 0800-172-772 (toll-free)\n\nType 0 to go back.`,
                                                '3': `📋 *ZRA Tax Services*\n\nFor ZRA services:\n• Self-service: taxonline.zra.org.zm\n• TIN registration: Any ZRA office\n• Call: 4040 (toll-free)\n\nType 0 to go back.`,
                                                '4': `📋 *PACRA Registration*\n\nRegister your business:\n• Online: pacra.org.zm\n• Cost: From K400\n• Takes 1-3 days\n• Call: +260 211 224 256\n\nType 0 to go back.`,
                                                '5': `📋 *Council Permits*\n\nFor business/trading permits:\n• Visit your nearest council office\n• Bring: NRC, business address proof\n• Lusaka City Council: Cairo Rd\n• Kitwe CC: Freedom Ave\n\nType 0 to go back.`
                                  }
                                  if (govServices[msg]) {
                                                await send(userPhone, govServices[msg])
                                  } else {
                                                await send(userPhone, GOV_MENU)
                                  }
                      }
            } else {
                      // Unknown step — reset to welcome
                console.log(`Unknown step "${step}" — resetting`)
                      await updateConv(userPhone, { step: 'WELCOME', context: {} })
                      await send(userPhone, MAIN_MENU)
            }
      }

      return NextResponse.json({ status: 'ok' })
    } catch (err) {
          console.error('❌ Webhook error:', err)
          return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({ status: 'Peza WhatsApp Bot v4.0 — Live 🚀' })
}
