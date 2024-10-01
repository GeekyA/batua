"use client";

import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import WalletCard from "./walletcard";
import { useSession } from "next-auth/react";
import { prefix } from "@/lib/api_prefix";

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

interface MnemonicFormProps {
    initialWallets: Wallet[]
    initialMnemonic: string;
}

const MnemonicForm: React.FC<MnemonicFormProps> = ({ initialMnemonic, initialWallets }) => {
    const { status, data: session } = useSession();
    const [wallets, setWallets] = useState<Wallet[]>(initialWallets); // Declare state at the top level
    const [mnemonicInput, setMnemonicInput] = useState<string>(initialMnemonic); // Initialize with initialMnemonic
    console.log("here wallets", wallets)


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (status === 'authenticated') {
            const walletNum = wallets.length;
            const network = 'sol';

            fetch(`${prefix}/api/wallet?mnemonic=${mnemonicInput}&network=${network}&walletNum=${walletNum}`)
            .then(response => response.json())
            .then((newWallet) => {
                fetch('http://localhost:3000/api/wallet', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Set the content type to JSON
                    },
                    body: JSON.stringify({
                        userEmail: session?.user?.email,  
                        name: session?.user?.name,        
                        mnemonic: mnemonicInput,          
                        wallets: [newWallet]                   
                    })
                })
            console.log(wallets)
            const newWallets = [...wallets,newWallet] 
            console.log("here here",newWallets)
            setWallets(newWallets)
            }).catch(error => console.error('Error:', error));

            
        }   
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {wallets.length < 1 ? (
                    <div className="space-y-4">
                        
                        <p className="text-gray-600">Your 12-phrase mnemonic (save it with utmost security!)</p>

                        <Textarea
                            placeholder={initialMnemonic}
                            value={mnemonicInput}
                            onChange={(e) => setMnemonicInput(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <p className="text-xs text-gray-500">
                            You can paste your own mnemonic from an existing wallet to import it.
                        </p>
                    </div>
                ) : null}

                <Button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                >
                    Add wallet +
                </Button>
            </form>

            {wallets.length > 0 && (
                <div className="py-6 space-y-4">
                    {wallets.map((w, i) => (
                        <WalletCard
                            key={i}
                            publicKey={w.public}
                            walletNumber={i}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MnemonicForm;
