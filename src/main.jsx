import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum } from "@reown/appkit/networks";
function Root() {
  // create a safe adapter factory that only runs in browser
const modal = createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, arbitrum],
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

  // project id is kept as env name the same you used before
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

  // If AppKit is not present or adapter not configured, App will still run (fallback UI)
  const metadata = {
  name: "nol",
  description: "nol Ex",
  url: "https://zrczerocoin.github.io/nol", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

  return <App />
}

createRoot(document.getElementById('root')).render(<Root />)
