'use server'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SiSolana } from "react-icons/si";

import { Button } from "./ui/button"



interface Wallet {
    publicKey: string,
    balance: number
}

export default async function Wallet({ publicKey, balance }: Wallet) {

    
    console.log("balance", balance)

    return <div className="flex justify-center items-center bg-white">
    <div className="w-full max-w-sm">
        <Card className="bg-white shadow-lg rounded-lg p-6">
            <CardHeader>
                <div className="text-center mb-4">
                    <CardTitle className="text-4xl font-bold text-black-600">{balance} SOL</CardTitle>
                    <CardDescription className="text-gray-500 text-sm">{
                    publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                    
                    </CardDescription>
                </div>
            </CardHeader>
        </Card>
    </div>
</div>

}