import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link"

interface WalletProps{
    publicKey: string,
    walletNumber: number
}

export default function WalletCard({publicKey, walletNumber}: WalletProps){
    return <div>
    <Card>
        <CardHeader>
        <CardTitle>Wallet number {walletNumber}</CardTitle>
        <CardDescription>{publicKey}</CardDescription>
        </CardHeader>
        <CardContent>
        <Link href={`/wallet/${publicKey}`}>
            Open wallet
        </Link>
        
        </CardContent>
  </Card>
  </div>

}