export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY || '',
  ZEROX_API_KEY: import.meta.env.VITE_ZEROX_API_KEY || '',
  WALLETCONNECT_PROJECT_ID: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
  FALLBACK_RPC_1: import.meta.env.VITE_FALLBACK_RPC_1 || 'https://polygon-rpc.com',
  FALLBACK_RPC_2: import.meta.env.VITE_FALLBACK_RPC_2 || 'https://rpc-mainnet.maticvigil.com',
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID || 137),
}
