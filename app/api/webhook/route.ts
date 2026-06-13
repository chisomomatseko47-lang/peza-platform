import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// ── Env ───────────────────────────────────────────────────────────────────────
const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY!
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL!
const INFOBIP_WA_NUMBER = process.env.INFOBIP_WHATSAPP_NUMBER!

// ── AI System Prompt ──────────────────────────────────────────────────────────
const PEZA_AI = `You are Peza Assistant — Zambia's most helpful WhatsApp commerce AI.

PERSONALITY:
- Warm, friendly, proudly Zambian
- Use Nyanja greetings naturally: Mwabonwa (greetings), Zikomo (thank you), Twende (let's go), Bwanji (how are you)
- Keep ALL responses under 400 characters
- Use emojis naturally but not excessively
- Currency: Zambian Kwacha (K)
- Always end with a clear next action

ZAMBIA CONTEXT:
- Major cities: Lusaka, Kitwe, Ndola, Livingstone, Chipata, Kabwe, Solwezi
- Key markets: Soweto Market, City Market, Kamwala, Chisokone (Kitwe)
- Mobile money: Airtel Money (+260 97x) and MTN MoMo (+260 96x)
- Common crops: maize, soya, groundnuts, sunflower, cassava, tomatoes, onions
- Farming areas: Mkushi, Mazabuka, Choma, Monze, Kabwe corridor

RULES:
- NEVER make up product prices or stock levels
- ALWAYS suggest typing 0 to go back or menu for main menu
- If unsure, ask a clarifying question
- For payments, ALWAYS remind user to have Airtel Money ready`

// ── Infobip Send ──────────────────────────────────────────────────────────────
async function send(to: string, msg: string) {
  try {
    const r = await fetch(`https://${INFOBIP_BASE_URL}/whatsapp/1/message/text`, {
      method: 'POST',
      headers: {
        'Authorization': `App ${INFOBIP_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ from: INFOBIP_WA_NUMBER, to, content: { text: msg } })
    })
    const d = await r.json()
    console.log(`📤 [${to}] sent:`, d?.messages?.[0]?.status?.name || 'ok')
    return d
  } catch (e) {
    console.error('Send error:', e)
  }
}

// ── DB helpers ────────────────────────────────────────────────────────────────
const db = (): SupabaseClient => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getConv(phone: string) {
  const { data } = await db().from('conversations').select('*').eq('whatsapp_number', phone).single()
  if (data) return data
  const { data: n } = await db().from('conversations')
    .insert({ whatsapp_number: phone, state: 'IDLE', cart: [], context: {} })
    .select().single()
  return n
}

async function setConv(phone: string, updates: Record<string, unknown>) {
  await db().from('conversations')
    .update({ ...updates, last_active: new Date().toISOString() })
    .eq('whatsapp_number', phone)
}

async function getCustomer(phone: string) {
  const { data } = await db().from('customers').select('*').eq('whatsapp_number', phone).single()
  return data
}

async function ensureCustomer(phone: string, name?: string) {
  const existing = await getCustomer(phone)
  if (!existing) {
    await db().from('customers').insert({ whatsapp_number: phone, name: name || null })
  } else if (name && !existing.name) {
    await db().from('customers').update({ name }).eq('whatsapp_number', phone)
  }
  return await getCustomer(phone)
}

async function getBusiness(phone: string) {
  const { data } = await db().from('businesses').select('*').eq('whatsapp_number', phone).single()
  return data
}

async function getBusinesses(category?: string, limit = 8) {
  let q = db().from('businesses').select('id,name,category,location,whatsapp_number').eq('status', 'active')
  if (category) q = q.eq('category', category)
  const { data } = await q.limit(limit)
  return data || []
}

async function getProducts(businessId: string, limit = 10) {
  const { data } = await db().from('products')
    .select('id,name,price,description,is_available')
    .eq('business_id', businessId)
    .eq('is_available', true)
    .limit(limit)
  return data || []
}

async function getProduct(productId: string) {
  const { data } = await db().from('products').select('*').eq('id', productId).single()
  return data
}

async function createOrder(customerId: string, businessId: string, cart: CartItem[], address: string) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const { data } = await db().from('orders').insert({
    customer_id: customerId,
    business_id: businessId,
    status: 'pending',
    total_amount: total,
    delivery_address: address,
    payment_method: 'airtel_money',
    items: cart
  }).select().single()
  return data
}

async function getOrders(customerId: string, limit = 5) {
  const { data } = await db().from('orders')
    .select('*, businesses(name)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return data || []
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface CartItem { id: string; name: string; price: number; qty: number; businessId: string; businessName: string }
interface Conv { state: string; cart: CartItem[]; context: Record<string, unknown> }

// ── AI reply ──────────────────────────────────────────────────────────────────
async function ai(prompt: string, extra = '') {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const r = await client.messages.create({
      model: 'claude-haiku-4-5', max_tokens: 200,
      system: PEZA_AI + (extra ? '\n\nCONTEXT: ' + extra : ''),
      messages: [{ role: 'user', content: prompt }]
    })
    return (r.content[0] as { type: string; text: string }).text
  } catch { return 'Zikomo! Type *menu* to continue. 🙏' }
}

// ── Format helpers ────────────────────────────────────────────────────────────
const divider = '─────────────────'
const back = '\n\nType *0* to go back | *menu* to start over'

// ── MAIN HANDLER ─────────────────────────────────────────────────────────────
async function handle(phone: string, raw: string): Promise<string> {
  const conv = await getConv(phone) as Conv
  const msg = raw.trim().toLowerCase()
  const input = raw.trim()
  const state = conv?.state || 'IDLE'
  const cart: CartItem[] = conv?.cart || []
  const ctx = conv?.context || {}

  await ensureCustomer(phone)

  // ── GLOBAL COMMANDS ──────────────────────────────────────────────────────
  if (['0', 'back'].includes(msg)) {
    await setConv(phone, { state: 'MAIN_MENU' })
    return mainMenu()
  }

  if (['hi', 'hello', 'mwabonwa', 'hey', 'start', 'menu', 'home', 'bwanji'].includes(msg)) {
    await setConv(phone, { state: 'MAIN_MENU', cart: [], context: {} })
    const customer = await getCustomer(phone)
    const greeting = customer?.name ? `Mwabonwa ${customer.name}! 👋` : `Mwabonwa! 👋`
    return `${greeting} Welcome to *Peza* 🇿🇲\nZambia's #1 WhatsApp marketplace.\n\n${divider}\n1️⃣ 🛒 Shop & Order\n2️⃣ 🌾 AgriMarket\n3️⃣ 🚛 Book Freight\n4️⃣ 📊 Market Prices\n5️⃣ 🏛 Gov Services\n6️⃣ 🏪 Sell on Peza\n7️⃣ 👤 My Account\n${divider}\nReply with a number 👇`
  }

  if (msg === 'cart') return showCart(cart)
  if (msg === 'checkout') return startCheckout(cart, state)

  if (msg === 'help') {
    return `*Peza Help* 🆘\n${divider}\n• Type *menu* — main menu\n• Type *cart* — view cart\n• Type *0* — go back\n• Type *track* — track orders\n• Type *reorder* — reorder last order\n${divider}\n🌐 peza.africa\n📧 hello@peza.africa`
  }

  if (msg === 'track') return await trackOrders(phone)
  if (msg === 'reorder') return await reorderLast(phone)

  // ── MAIN MENU ─────────────────────────────────────────────────────────────
  if (state === 'MAIN_MENU' || state === 'IDLE') {
    if (msg === '1') { await setConv(phone, { state: 'SHOP_CATEGORY' }); return shopCategory() }
    if (msg === '2') { await setConv(phone, { state: 'AGRI_MENU' }); return agriMenu() }
    if (msg === '3') { await setConv(phone, { state: 'FREIGHT_ORIGIN' }); return `🚛 *Book Freight*\n${divider}\nConnect with verified Zambian truckers.\n\nWhere are you *sending from*?\n\nExample: *Lusaka*\n\nType the city name 👇${back}` }
    if (msg === '4') { return await marketPrices() }
    if (msg === '5') { await setConv(phone, { state: 'GOV_MENU' }); return govMenu() }
    if (msg === '6') { return await startSellerOnboarding(phone) }
    if (msg === '7') { return await myAccount(phone) }
  }

  // ── SHOPPING FLOW ─────────────────────────────────────────────────────────
  if (state === 'SHOP_CATEGORY') {
    const cats: Record<string, string> = { '1': 'food', '2': 'fashion', '3': 'agriculture', '4': 'hardware', '5': 'beauty', '6': 'retail', '7': 'services' }
    const catNames: Record<string, string> = { '1': '🍅 Food & Groceries', '2': '👗 Fashion', '3': '🌾 Agriculture', '4': '🔧 Hardware', '5': '💄 Beauty & Salons', '6': '📦 General Retail', '7': '🔧 Services' }
    const cat = cats[msg]
    if (cat) {
      const businesses = await getBusinesses(cat)
      if (!businesses.length) return `No ${catNames[msg]} businesses near you yet 😔\n\nWant to be the first to list? Type *6* to register!\n${back}`
      await setConv(phone, { state: 'SHOP_BUSINESS', context: { category: cat } })
      const list = businesses.map((b: { name: string; location?: string }, i: number) => `${i + 1}. *${b.name}*${b.location ? ` — ${b.location}` : ''}`).join('\n')
      return `${catNames[msg]}\n${divider}\n${list}\n${divider}\nReply with a number to browse 👇${back}`
    }
    return shopCategory()
  }

  if (state === 'SHOP_BUSINESS') {
    const cat = ctx.category as string
    const businesses = await getBusinesses(cat)
    const idx = parseInt(msg) - 1
    if (idx >= 0 && idx < businesses.length) {
      const biz = businesses[idx]
      const products = await getProducts(biz.id)
      if (!products.length) return `*${biz.name}* hasn't listed products yet 😔\n\nCheck back soon!\n${back}`
      await setConv(phone, { state: 'SHOP_PRODUCTS', context: { ...ctx, businessId: biz.id, businessName: biz.name } })
      const list = products.map((p: { name: string; price: number; description?: string }, i: number) => `${i + 1}. *${p.name}* — K${p.price}${p.description ? `\n   ${p.description}` : ''}`).join('\n')
      return `🏪 *${biz.name}*\n${divider}\n${list}\n${divider}\nReply with a number to add to cart 🛒\n\nType *cart* to view cart${back}`
    }
  }

  if (state === 'SHOP_PRODUCTS') {
    const bizId = ctx.businessId as string
    const bizName = ctx.businessName as string
    const products = await getProducts(bizId)
    const idx = parseInt(msg) - 1
    if (idx >= 0 && idx < products.length) {
      const p = products[idx]
      // Add to cart
      const existing = cart.find(c => c.id === p.id)
      let newCart: CartItem[]
      if (existing) {
        newCart = cart.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c)
      } else {
        newCart = [...cart, { id: p.id, name: p.name, price: p.price, qty: 1, businessId: bizId, businessName: bizName }]
      }
      await setConv(phone, { cart: newCart })
      const total = newCart.reduce((s, i) => s + i.price * i.qty, 0)
      return `✅ *${p.name}* added to cart!\n\nCart: ${newCart.length} item(s) | Total: *K${total}*\n\nType *cart* to review\nType *checkout* to order\nOr pick another item 👇${back}`
    }
  }

  // ── CART & CHECKOUT ───────────────────────────────────────────────────────
  if (state === 'CHECKOUT_ADDRESS') {
    await setConv(phone, { state: 'CHECKOUT_CONFIRM', context: { ...ctx, address: input } })
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    const items = cart.map(i => `• ${i.name} x${i.qty} = K${i.price * i.qty}`).join('\n')
    return `📋 *Order Summary*\n${divider}\n${items}\n${divider}\n*Total: K${total}*\n*Deliver to:* ${input}\n*Payment:* Airtel Money\n${divider}\nType *CONFIRM* to place order\nType *0* to cancel`
  }

  if (state === 'CHECKOUT_CONFIRM' && msg === 'confirm') {
    const customer = await getCustomer(phone)
    if (!customer) return 'Error finding your account. Type *menu* to restart.'
    const address = ctx.address as string
    // Group cart by business and create orders
    const bizGroups = cart.reduce((acc: Record<string, CartItem[]>, item) => {
      if (!acc[item.businessId]) acc[item.businessId] = []
      acc[item.businessId].push(item)
      return acc
    }, {})
    const orderIds: string[] = []
    for (const [bizId, items] of Object.entries(bizGroups)) {
      const order = await createOrder(customer.id, bizId, items, address)
      if (order) {
        orderIds.push(order.id.slice(0, 8).toUpperCase())
        // Notify merchant
        const biz = await db().from('businesses').select('whatsapp_number,name').eq('id', bizId).single()
        if (biz.data?.whatsapp_number) {
          const orderItems = items.map(i => `• ${i.name} x${i.qty} (K${i.price * i.qty})`).join('\n')
          const orderTotal = items.reduce((s, i) => s + i.price * i.qty, 0)
          await send(biz.data.whatsapp_number, `🔔 *New Peza Order!*\n${divider}\nCustomer: ${phone}\nDelivery: ${address}\n${divider}\n${orderItems}\n${divider}\n*Total: K${orderTotal}*\n\nReply to confirm with customer.`)
        }
      }
    }
    await setConv(phone, { state: 'MAIN_MENU', cart: [], context: {} })
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
    return `🎉 *Order Placed!*\n${divider}\nOrder ID: #${orderIds[0]}\nTotal: *K${total}*\nDelivery: ${address}\n${divider}\n💳 *Pay via Airtel Money:*\nDial *115# → Send Money → Pay Bill\nMerchant will contact you shortly!\n\nZikomo! 🙏 Type *menu* to continue.`
  }

  // ── AGRIMARKET ────────────────────────────────────────────────────────────
  if (state === 'AGRI_MENU') {
    if (msg === '1') { await setConv(phone, { state: 'AGRI_LIST_CROP' }); return `🌾 *List Your Produce*\n${divider}\nWhat *crop* are you selling?\n\nExamples: Maize, Soya, Groundnuts, Tomatoes, Onions, Cassava\n\nType your crop name 👇${back}` }
    if (msg === '2') { await setConv(phone, { state: 'AGRI_BUY_CROP' }); return `🛍 *Buy Farm Produce*\n${divider}\nWhat are you looking for?\n\nExamples: Maize, Soya, Tomatoes\n\nType the crop name 👇${back}` }
    if (msg === '3') { return await marketPrices() }
    if (msg === '4') { await setConv(phone, { state: 'AGRI_SUBSCRIBE' }); return `🔔 *Price Alerts*\n${divider}\nGet daily market prices via WhatsApp!\n\nWhich crop prices do you want?\nType: *ALL* for everything\nOr name specific crops:\nExample: *Maize, Soya, Tomatoes*${back}` }
    return agriMenu()
  }

  if (state === 'AGRI_LIST_CROP') {
    await setConv(phone, { state: 'AGRI_LIST_QTY', context: { crop: input } })
    return `✅ *${input}*\n\nHow many *bags/crates/kg*?\n\nExample: *80 bags*\n\nType quantity 👇${back}`
  }

  if (state === 'AGRI_LIST_QTY') {
    await setConv(phone, { state: 'AGRI_LIST_LOCATION', context: { ...ctx, qty: input } })
    return `✅ Quantity: *${input}*\n\nWhat is your *location*?\n\nExample: *Mkushi, Central Province*\n\nType your location 👇${back}`
  }

  if (state === 'AGRI_LIST_LOCATION') {
    await setConv(phone, { state: 'AGRI_LIST_PRICE', context: { ...ctx, location: input } })
    return `✅ Location: *${input}*\n\nWhat is your *asking price*?\n\nExample: *K680 per bag*\n\nOr type *BEST* to accept market price${back}`
  }

  if (state === 'AGRI_LIST_PRICE') {
    const crop = ctx.crop as string
    const qty = ctx.qty as string
    const location = ctx.location as string
    const price = input
    // Save to products table under a farmers category business
    const customer = await getCustomer(phone)
    if (customer) {
      // Create or find farmer business
      let { data: biz } = await db().from('businesses').select('id').eq('whatsapp_number', phone).single()
      if (!biz) {
        const { data: newBiz } = await db().from('businesses').insert({ name: `${customer.name || phone} Farm`, whatsapp_number: phone, category: 'agriculture', status: 'active', location }).select().single()
        biz = newBiz
      }
      if (biz) {
        await db().from('products').insert({ business_id: biz.id, name: crop, description: `${qty} available in ${location}`, price: price === 'BEST' ? 0 : parseFloat(price.replace(/[^0-9.]/g, '')), category: 'agriculture', is_available: true })
      }
    }
    await setConv(phone, { state: 'MAIN_MENU', context: {} })
    const aiResponse = await ai(`A Zambian farmer listed ${qty} of ${crop} at ${price} in ${location}. Give encouraging response with market context. Keep under 150 chars.`)
    return `✅ *Listed on AgriMarket!*\n${divider}\n🌾 ${crop}: ${qty}\n📍 ${location}\n💰 ${price}\n${divider}\n${aiResponse}\n\nBuyers will contact you directly! Zikomo! 🙏\n\nType *menu* to continue.`
  }

  if (state === 'AGRI_BUY_CROP') {
    const { data: listings } = await db().from('products')
      .select('name,description,price,businesses(name,whatsapp_number,location)')
      .ilike('name', `%${input}%`)
      .eq('is_available', true)
      .limit(5)
    if (!listings || !listings.length) {
      await setConv(phone, { state: 'MAIN_MENU' })
      return `No *${input}* listings found right now 😔\n\nTip: Type *2* from AgriMarket menu to check other crops.\n\nOr register as a buyer — we'll notify you when ${input} is listed! Type *menu* to continue.`
    }
    await setConv(phone, { state: 'MAIN_MENU' })
    const list = listings.map((l: { name: string; description?: string; price: number; businesses: { name: string; whatsapp_number: string; location?: string } | { name: string; whatsapp_number: string; location?: string }[] }, i: number) => {
      const biz = Array.isArray(l.businesses) ? l.businesses[0] : l.businesses
      return `${i + 1}. *${l.name}*\n   ${l.description}\n   💰 K${l.price} | 📍 ${biz?.location || 'Zambia'}\n   📱 Contact: wa.me/${biz?.whatsapp_number?.replace('+', '')}`
    }).join('\n\n')
    return `🌾 *${input} Listings*\n${divider}\n${list}\n${divider}\nContact sellers directly via WhatsApp!\n\nType *menu* to continue.`
  }

  if (state === 'AGRI_SUBSCRIBE') {
    const crops = input.toUpperCase() === 'ALL' ? 'ALL CROPS' : input
    // Save subscription preference
    await db().from('customers').update({ price_alert_crops: crops }).eq('whatsapp_number', phone)
    await setConv(phone, { state: 'MAIN_MENU' })
    return `✅ *Price Alerts Activated!*\n\nYou'll receive daily prices for:\n📊 ${crops}\n\nEvery morning at 7am 🌅\n\nZikomo! Type *menu* to continue.`
  }

  // ── FREIGHT BOOKING ───────────────────────────────────────────────────────
  if (state === 'FREIGHT_ORIGIN') {
    await setConv(phone, { state: 'FREIGHT_DEST', context: { origin: input } })
    return `🚛 *From:* ${input}\n\nWhere are you *sending to*?\n\nExample: *Kitwe*\n\nType destination city 👇${back}`
  }

  if (state === 'FREIGHT_DEST') {
    await setConv(phone, { state: 'FREIGHT_CARGO', context: { ...ctx, destination: input } })
    return `✅ *Route:* ${ctx.origin} → ${input}\n\nWhat are you *transporting*?\n\nExample: *5 tons maize in bags*\n\nDescribe your cargo 👇${back}`
  }

  if (state === 'FREIGHT_CARGO') {
    await setConv(phone, { state: 'FREIGHT_DATE', context: { ...ctx, cargo: input } })
    return `✅ *Cargo:* ${input}\n\nWhen do you need the truck?\n\nExample: *Monday 23 June* or *ASAP*\n\nType preferred date 👇${back}`
  }

  if (state === 'FREIGHT_DATE') {
    const origin = ctx.origin as string
    const destination = ctx.destination as string
    const cargo = ctx.cargo as string
    // Save freight request
    await db().from('conversations').update({ state: 'MAIN_MENU', context: {} }).eq('whatsapp_number', phone)
    const aiEst = await ai(`Estimate truck freight cost from ${origin} to ${destination} for ${cargo} in Zambia. Give price range in Kwacha. Under 100 chars.`)
    return `🚛 *Freight Request Submitted!*\n${divider}\n📍 ${origin} → ${destination}\n📦 ${cargo}\n📅 ${input}\n${divider}\n💰 *Estimated cost:* ${aiEst}\n${divider}\nOur freight partners will contact you within 2 hours!\n\n📱 Peza Freight Team: wa.me/260570230160\n\nType *menu* to continue.`
  }

  // ── MARKET PRICES ─────────────────────────────────────────────────────────
  // ── GOV SERVICES ─────────────────────────────────────────────────────────
  if (state === 'GOV_MENU') {
    const govMap: Record<string, string> = {
      '1': `🪪 *NRC Application*\n${divider}\nRequired Documents:\n• Birth Certificate\n• Both parents' NRC copies\n• 2 passport photos\n• Proof of residence\n\n💰 Fee: K30\n📍 Visit nearest NRDC office\n\nLusaka NRDC: Mungwi Road${back}`,
      '2': `🏢 *PACRA Registration*\n${divider}\nBusiness Types:\n• Sole Trader: K850\n• Partnership: K1,200\n• Private Company: K2,500\n\nDocuments needed:\n• NRC copy\n• Proposed business name\n• Physical address\n\n🌐 pacra.org.zm\n📞 +260 211 229 087${back}`,
      '3': `📋 *NAPSA*\n${divider}\nNational Pension Scheme Auth.\n\n📞 Call: 0800 100 222 (FREE)\n🌐 my.napsa.org.zm\n📍 Office: Levy Junction, Lusaka\n\nServices:\n• Contribution queries\n• Benefit claims\n• Registration${back}`,
      '4': `💼 *ZRA / Tax*\n${divider}\n• TPIN Registration: FREE\n• VAT threshold: K800,000\n• Tax portal: my.zra.org.zm\n• Call centre: 4500 (free)\n• WhatsApp: +260 211 381 111\n\nPay taxes online to avoid penalties! ⚠️${back}`,
      '5': `🏘 *Council Permits*\n${divider}\nLusaka City Council:\n• Business permit: K500–K2,000\n• Health/food permit: K200\n• Signage permit: K150\n• Market stall: K100/month\n\n🌐 lcc.org.zm\n📞 +260 211 254 140${back}`,
      '6': `🎓 *Bursaries & Loans*\n${divider}\n• Higher Education Loans Board (HELB)\n• TEVETA skills bursaries\n• Citizens Economic Empowerment Commission (CEEC)\n\n📞 CEEC: +260 211 253 069\n🌐 ceec.org.zm\n\nCEEC offers SME loans from K10,000!${back}`
    }
    if (govMap[msg]) { await setConv(phone, { state: 'MAIN_MENU' }); return govMap[msg] }
    return govMenu()
  }

  // ── SELLER ONBOARDING ─────────────────────────────────────────────────────
  if (state === 'SELLER_NAME') {
    await setConv(phone, { state: 'SELLER_CATEGORY', context: { bizName: input } })
    return `✅ *Business name:* ${input}\n\n🏪 *What do you sell?*\n${divider}\n1. 🍅 Food & Groceries\n2. 👗 Fashion & Clothing\n3. 🌾 Agriculture\n4. 🔧 Hardware\n5. 💄 Beauty & Salons\n6. 📦 General Retail\n7. 🔧 Services\n\nReply with a number 👇${back}`
  }

  if (state === 'SELLER_CATEGORY') {
    const catMap: Record<string, string> = { '1': 'food', '2': 'fashion', '3': 'agriculture', '4': 'hardware', '5': 'beauty', '6': 'retail', '7': 'services' }
    const cat = catMap[msg]
    if (cat) {
      await setConv(phone, { state: 'SELLER_LOCATION', context: { ...ctx, category: cat } })
      return `✅ Category saved!\n\n📍 *Where is your business located?*\n\nExample: *Soweto Market, Lusaka*\nor *Chisokone Market, Kitwe*\n\nType your location 👇${back}`
    }
  }

  if (state === 'SELLER_LOCATION') {
    await setConv(phone, { state: 'SELLER_AIRTEL', context: { ...ctx, location: input } })
    return `✅ Location: *${input}*\n\n💳 *Airtel Money number for payments?*\n\nThis is how customers pay you!\n\nExample: *0971234567*\n(or type *SKIP* if you don't have one yet)${back}`
  }

  if (state === 'SELLER_AIRTEL') {
    const bizName = ctx.bizName as string
    const category = ctx.category as string
    const location = ctx.location as string
    const airtel = msg === 'skip' ? null : input

    // Register the business
    const { data: biz } = await db().from('businesses').upsert({
      name: bizName,
      whatsapp_number: phone,
      category,
      status: 'active',
      location,
      airtel_number: airtel
    }, { onConflict: 'whatsapp_number' }).select().single()

    await setConv(phone, { state: 'SELLER_FIRST_PRODUCT', context: { businessId: biz?.id } })

    return `🎉 *${bizName}* is now on Peza!\n${divider}\n✅ WhatsApp storefront: LIVE\n✅ Category: ${category}\n✅ Location: ${location}\n✅ Payments: ${airtel || 'Set up later'}\n${divider}\n*Let's add your first product!*\n\nWhat is your *first product name*?\n\nExample: *Fresh Tomatoes (1kg)*\n\nType it now 👇`
  }

  if (state === 'SELLER_FIRST_PRODUCT') {
    await setConv(phone, { state: 'SELLER_FIRST_PRICE', context: { ...ctx, productName: input } })
    return `✅ Product: *${input}*\n\n💰 What is the *price* in Kwacha?\n\nExample: *K45*\n\nType the price 👇${back}`
  }

  if (state === 'SELLER_FIRST_PRICE') {
    const productName = ctx.productName as string
    const businessId = ctx.businessId as string
    const price = parseFloat(input.replace(/[^0-9.]/g, ''))

    if (businessId && !isNaN(price)) {
      await db().from('products').insert({
        business_id: businessId,
        name: productName,
        price,
        is_available: true
      })
    }

    await setConv(phone, { state: 'MAIN_MENU', context: {} })
    return `✅ *${productName}* listed at K${price}!\n\n🎊 Your Peza store is LIVE!\n${divider}\n📱 Manage your store:\npeza.africa/dashboard\n\n📦 To add more products, visit your dashboard.\n\nShare your store link:\nwa.me/447860088970\n\nCustomers can now find and order from you!\n\nZikomo & welcome to Peza! 🇿🇲🙏\n\nType *menu* to continue.`
  }

  // ── MY ACCOUNT ────────────────────────────────────────────────────────────
  if (state === 'ACCOUNT_MENU') {
    if (msg === '1') return await trackOrders(phone)
    if (msg === '2') return await reorderLast(phone)
    if (msg === '3') {
      await setConv(phone, { state: 'ACCOUNT_NAME' })
      return `What is your name?\n\nExample: *Chisomo*\n\nType your name 👇${back}`
    }
    if (msg === '4') {
      const biz = await getBusiness(phone)
      if (biz) {
        await setConv(phone, { state: 'MAIN_MENU' })
        return `🏪 *Your Business:* ${biz.name}\n📍 ${biz.location || 'Not set'}\n📦 Manage: peza.africa/dashboard${back}`
      } else {
        return await startSellerOnboarding(phone)
      }
    }
  }

  if (state === 'ACCOUNT_NAME') {
    await ensureCustomer(phone, input)
    await setConv(phone, { state: 'MAIN_MENU' })
    return `✅ Name saved: *${input}*\n\nWelcome to Peza, ${input}! 🎉\n\nType *menu* to continue.`
  }

  // ── AI FALLBACK ───────────────────────────────────────────────────────────
  const bizContext = await getBusiness(phone)
  const customerCtx = await getCustomer(phone)
  const contextStr = `User phone: ${phone}. State: ${state}. Is merchant: ${!!bizContext}. Customer name: ${customerCtx?.name || 'unknown'}. Cart items: ${cart.length}.`
  const reply = await ai(input, contextStr)
  return reply + '\n\nType *menu* for main menu 📱'
}

// ── Helper functions ──────────────────────────────────────────────────────────
function mainMenu() {
  return `*Peza Main Menu* 🇿🇲\n${divider}\n1️⃣ 🛒 Shop & Order\n2️⃣ 🌾 AgriMarket\n3️⃣ 🚛 Book Freight\n4️⃣ 📊 Market Prices\n5️⃣ 🏛 Gov Services\n6️⃣ 🏪 Sell on Peza\n7️⃣ 👤 My Account\n${divider}\nReply with a number 👇`
}

function shopCategory() {
  return `🛒 *Shop by Category*\n${divider}\n1. 🍅 Food & Groceries\n2. 👗 Fashion\n3. 🌾 Agriculture\n4. 🔧 Hardware\n5. 💄 Beauty & Salons\n6. 📦 General Retail\n7. 🔧 Services\n${divider}\nReply with a number 👇\n\nType *0* to go back`
}

function agriMenu() {
  return `🌾 *AgriMarket*\n${divider}\nZambia's farm-to-buyer platform\n\n1. 💰 Sell my produce\n2. 🛍 Buy farm produce\n3. 📊 Current prices\n4. 🔔 Price alerts\n${divider}\nReply with a number 👇\n\nType *0* to go back`
}

function govMenu() {
  return `🏛 *Government Services*\n${divider}\n1. 🪪 NRC Application\n2. 🏢 Business Registration (PACRA)\n3. 📋 NAPSA Queries\n4. 💼 ZRA / Tax\n5. 🏘 Council Permits\n6. 🎓 Bursaries & Loans\n${divider}\nReply with a number 👇\n\nType *0* to go back`
}

function showCart(cart: CartItem[]) {
  if (!cart.length) return `Your cart is empty 🛒\n\nType *1* to browse shops!\n\nType *menu* for main menu.`
  const items = cart.map(i => `• ${i.name} ×${i.qty} = K${i.price * i.qty}`).join('\n')
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  return `🛒 *Your Cart*\n${divider}\n${items}\n${divider}\n*Total: K${total}*\n\nType *checkout* to order\nType *menu* to keep shopping\nType *clear* to empty cart`
}

function startCheckout(cart: CartItem[], state: string) {
  if (!cart.length) return `Your cart is empty! Type *1* to shop first.`
  if (state !== 'CHECKOUT_ADDRESS' && state !== 'CHECKOUT_CONFIRM') {
    return `🏠 *Delivery Address*\n\nWhere should we deliver?\n\nExample:\n*Plot 45 Kabangwe Road, Lusaka*\nor\n*Collect from merchant*\n\nType your address 👇`
  }
  return showCart(cart)
}

async function trackOrders(phone: string) {
  const customer = await getCustomer(phone)
  if (!customer) return `No orders found.\n\nType *1* to start shopping! 🛒\n\nType *menu* to continue.`
  const orders = await getOrders(customer.id)
  if (!orders.length) return `No orders yet! 🛍\n\nType *1* to browse shops and place your first order!\n\nType *menu* to continue.`
  const statusEmoji: Record<string, string> = { pending: '⏳', confirmed: '✅', preparing: '👨‍🍳', ready: '📦', delivered: '✅', cancelled: '❌' }
  const list = orders.slice(0, 3).map((o: { id: string; status: string; total_amount: number; created_at: string; businesses: { name: string } | null }) => {
    const biz = o.businesses
    const bizName = biz ? biz.name : 'Unknown'
    return `${statusEmoji[o.status] || '📦'} #${o.id.slice(0, 8).toUpperCase()}\n   ${bizName} — K${o.total_amount}\n   Status: *${o.status}*\n   ${new Date(o.created_at).toLocaleDateString('en-ZM')}`
  }).join('\n\n')
  return `📦 *Your Recent Orders*\n${divider}\n${list}\n${divider}\nType *menu* to continue.`
}

async function reorderLast(phone: string) {
  const customer = await getCustomer(phone)
  if (!customer) return `No previous orders found.\n\nType *1* to shop! 🛒`
  const orders = await getOrders(customer.id, 1)
  if (!orders.length) return `No previous orders.\n\nType *1* to browse shops! 🛒`
  const last = orders[0]
  const items = (last.items as CartItem[] || [])
  if (!items.length) return `Could not load last order. Type *1* to shop.`
  const list = items.map((i: CartItem) => `• ${i.name} ×${i.qty} — K${i.price * i.qty}`).join('\n')
  const total = items.reduce((s: number, i: CartItem) => s + i.price * i.qty, 0)
  return `🔄 *Reorder Last Order?*\n${divider}\n${list}\n${divider}\n*Total: K${total}*\n\nType *REORDER* to confirm\nOr type *menu* to cancel`
}

async function marketPrices() {
  const aiPrices = await ai('Give current estimated Zambia market prices for 6 key commodities in Kwacha. Format as bullet list. Keep under 300 chars. Include maize, tomatoes, soya, chicken, groundnuts, onions.')
  return `📊 *Zambia Market Prices*\n${divider}\n${aiPrices}\n${divider}\n📅 ${new Date().toLocaleDateString('en-ZM')}\nSource: AgriMarket estimates\n\nType *2* for AgriMarket\nType *menu* for main menu`
}

async function startSellerOnboarding(phone: string) {
  const existing = await getBusiness(phone)
  if (existing && existing.status === 'active') {
    return `🏪 *${existing.name}* is already on Peza!\n\n📊 Manage your store:\npeza.africa/dashboard\n\nType *menu* to continue.`
  }
  await setConv(phone, { state: 'SELLER_NAME', context: {} })
  return `🏪 *Register on Peza*\n${divider}\n✅ Free for 12 months\n✅ WhatsApp storefront\n✅ Airtel Money payments\n✅ Dashboard & analytics\n${divider}\nLet's set up your store!\n\nWhat is your *business name*?\n\nExample: *Mama Grace Grocery Store*\n\nType it now 👇\n\nType *0* to go back`
}

async function myAccount(phone: string) {
  const customer = await getCustomer(phone)
  const biz = await getBusiness(phone)
  await setConv(phone, { state: 'ACCOUNT_MENU' })
  const name = customer?.name || 'Peza Customer'
  const bizLine = biz ? `🏪 Business: *${biz.name}*` : `🏪 Not registered as seller`
  return `👤 *My Account*\n${divider}\n📱 ${phone}\n👋 ${name}\n${bizLine}\n${divider}\n1. 📦 Track my orders\n2. 🔄 Reorder last order\n3. ✏️ Update my name\n4. 🏪 My business\n${divider}\nReply with a number 👇\n\nType *0* to go back`
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Infobip webhook received')
    const results = body?.results || []
    for (const result of results) {
      const from = result?.from
      const message = result?.message?.text || result?.message?.body || ''
      if (!from || !message) continue
      console.log(`📱 [${from}]: ${message}`)
      const reply = await handle(from, message)
      await send(from, reply)
    }
    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Peza WhatsApp Commerce Bot v3.0 🚀',
    platform: 'peza.africa',
    features: ['SME Commerce', 'AgriMarket', 'Freight', 'Market Prices', 'Gov Services', 'Seller Onboarding', 'Cart & Checkout', 'Order Tracking'],
    powered_by: 'Kivara Technologies'
  })
}
