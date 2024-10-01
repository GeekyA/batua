import MnemonicForm from "@/components/mnemonic";
import authOptions from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";



export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Wallet {
    public: string;
    private: string;
    address: string;
    network: string;
}

interface UnsanitizedWallet {
    public: string;
    private: string;
    address: string;
    network: string;
    _id: string;
}

async function getMnemonic() {
    const url = `${process.env.API_URL}/api/mnemonic`
    
    try{
        const resp = await fetch(url,{
            cache: "no-store"
        })
        if(resp.ok){
            return resp.json()
        }
        else{
            return Error("Unable to generate mnemonic")
        }

    }catch(err){
        throw new Error("Unable to generate mnemonic")
    }
    
}

async function fetchWalletData(email: string, cookieHeader: string) {
    try {
        const response = await fetch(`${process.env.API_URL}/api/wallet/${email}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader, // Pass the session cookie explicitly
            },
        });

        const resp = await response.json();

        // Process the response to remove `_id`
        const resp_wallets: UnsanitizedWallet[] = resp.wallets;
        const sanitizedWallets = resp_wallets.map(({ _id, ...rest }) => rest); // Remove _id
        
        return sanitizedWallets;
    } catch (err) {
        console.error("Error fetching or processing wallets", err);
        return []; // Return an empty array or handle the error accordingly
    }
}


export default async function MnemonicConfirm(){

    

    const session = await getServerSession(authOptions);
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();
    
    let initWallets: Wallet[] = [];
    const email = session?.user?.email;
    const wallets = session ? await fetchWalletData(email || "", cookieHeader) : [];
    
    const mnemonic = await getMnemonic()


    return <div>
        <div className="px-10 py-10 font-bold">
            
            <div className="py-5">
                
                <MnemonicForm initialWallets={wallets} initialMnemonic={mnemonic.mnemonic}/>
            </div>
        
        </div>
        
        
    </div>
}