import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'logistics-erp-supabase-7rpw88ef',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_CnMeez5-IYwwLTG68VC47AujiFNR0Xr8',
  authRequired: false,
  auth: { mode: 'managed' },
})
