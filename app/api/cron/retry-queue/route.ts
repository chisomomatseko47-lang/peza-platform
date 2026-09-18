import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY!
const INFOBIP_BASE_URL = process.env.INFOBIP_BASE_URL!
const INFOBIP_WA_NUMBER = process.env.INFOBIP_WHATSAPP_NUMBER!

const db = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function sendDirect(to: string, msg: string) {
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
  const status = d?.messages?.[0]?.status
  if (status?.groupName === 'REJECTED' || status?.groupName === 'UNDELIVERABLE') {
    throw new Error(status?.name || 'send rejected')
  }
  return d
}

// Runs on a schedule (see vercel.json cron entry). Retries queued messages
// that failed to send earlier — most often due to connectivity gaps or
// load shedding on the recipient's end.
export async function GET() {
  const MAX_ATTEMPTS = 5
  const { data: queued } = await db()
    .from('message_retry_queue')
    .select('*')
    .eq('status', 'queued')
    .lte('attempts', MAX_ATTEMPTS)
    .limit(50)

  let sent = 0, failed = 0, permanentlyFailed = 0

  for (const item of queued || []) {
    try {
      await sendDirect(item.whatsapp_number, item.payload?.text || '')
      await db().from('message_retry_queue').update({ status: 'sent' }).eq('id', item.id)
      sent++
    } catch (e) {
      const attempts = (item.attempts || 0) + 1
      if (attempts >= MAX_ATTEMPTS) {
        await db().from('message_retry_queue').update({ status: 'failed_permanently', attempts }).eq('id', item.id)
        permanentlyFailed++
      } else {
        await db().from('message_retry_queue').update({ attempts }).eq('id', item.id)
        failed++
      }
    }
  }

  return NextResponse.json({ status: 'ok', sent, retried: failed, permanentlyFailed })
}
