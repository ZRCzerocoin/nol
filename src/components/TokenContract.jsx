import React from 'react'
import { useAppKitProvider, useAppKitAccount } from '@reown/appkit/react'
import { BrowserProvider, Contract, formatUnits } from 'ethers'

const USDTAddress = '0x617f3112bf5397D0467D315cC709EF968D9ba546'
const USDTAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)'
]

export default function TokenContract(){
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')

  async function getBalance(){
    if(!isConnected) return alert('Not connected')
    const ethersProvider = new BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
    const bal = await USDTContract.balanceOf(address)
    alert('USDT balance: ' + formatUnits(bal, 18))
  }

  return (<div><button onClick={getBalance}>Get USDT Balance (via AppKit)</button></div>)
}
