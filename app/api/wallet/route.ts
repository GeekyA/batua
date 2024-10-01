import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import Wallet from "@/models/wallet";

function uint8ArrayToHex(uint8Array: Uint8Array): string {
    return Array.from(uint8Array) // Convert Uint8Array to a regular array
        .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to hex
        .join(''); // Join all hex values into a single string
}
interface IWallet {
    public: string;
    private: string;
    address: string;
    network: string;
}

interface IWalletDocument {
    userEmail: string;
    name: string;
    mnemonic: string;
    wallets: IWallet[];
    createdAt?: Date; // Automatically added by Mongoose timestamps
    updatedAt?: Date; // Automatically added by Mongoose timestamps
}

export async function GET(request:Request) {
    
    const {searchParams} = new URL(request.url)
    const mnemonic = searchParams.get('mnemonic');
    const network = searchParams.get('network');
    const walletNum = searchParams.get('walletNum');
    const eth_hd_path = `m/44'/60'/${walletNum}'/0'`
    const sol_hd_path = `m/44'/501'/${walletNum}'/0'`;
    if (mnemonic){
        if (network === 'sol'){ 
            const seed = await mnemonicToSeed(mnemonic);
            const derivedSeed = derivePath(sol_hd_path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const keypair = Keypair.fromSecretKey(secret);
            const privateKey = Buffer.from(secret).toString("hex");
            const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58()
            const response = {private: privateKey, public: publicKey, address: publicKey}
            return NextResponse.json(response, {status:200})
        }
    }
    
}

export async function POST(request: Request){
    const {userEmail, name, mnemonic, wallets} = await request.json();
    await connectMongoDb();

    const existingWallets = await Wallet.findOne({userEmail})

    if(existingWallets) {
        const newWallets = [...existingWallets.wallets,...wallets]
        const doc = {userEmail, name, mnemonic, wallets: newWallets}
        await Wallet.findOneAndUpdate({userEmail},doc)

    }
    else{
        await Wallet.create({userEmail, name, mnemonic, wallets})
    }


    // await Wallet.create(req);
    return NextResponse.json({"status": "success"}, {status:201})
}