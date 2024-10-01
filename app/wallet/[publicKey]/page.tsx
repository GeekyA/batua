'use server'
import Wallet from "@/components/show-wallet"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { LuCopy } from "react-icons/lu"
import authOptions from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { cookies } from "next/headers"
import CopyPrivate from "@/components/copyprivate"
import SendSol from "@/components/sendbutton"

interface Wallet {
    public: string;
    private: string;
    address: string;
    network: string;
}

export default async function ShowWallet({params}: {
    params: {publicKey: string}
}){


    //const {status, data: session} = useSession()
    //const [pk, setPrivate] = useState("")
    const session = await getServerSession(authOptions)
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();
    let privateKey;

    try{
        const r = await fetch(`${process.env.API_URL}/api/wallet/pk/${session?.user?.email}?publicKey=${params.publicKey}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader, // Pass the session cookie explicitly
            },
        });
    
        const pk = await r.json()
        privateKey = pk.privateKey
    }catch(err){
        throw err
    }
    const api_url = `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`

    const get_resp = await fetch(api_url, {
        cache: "no-store",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getAccountInfo",
                "params": [params.publicKey]
            }
        )
    })


    const response = await get_resp.json()

    const balance = response.result.value ? (response.result.value.lamports) / 1e9 : 0.0
   


    


    return (session)?<div>
        <Wallet publicKey={params.publicKey} balance={balance}/>
        <div className="flex justify-center py-10 gap-10">
        <SendSol publicKey={params.publicKey} privateKey={privateKey?privateKey:""} availableSol={balance}/>
        <CopyPrivate publicKey={params.publicKey}/>

        
        </div>
    </div>:<div>Please sign in!</div>
    

}