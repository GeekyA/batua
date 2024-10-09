
import nacl from "tweetnacl";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { NextResponse } from "next/server";
import connectMongoDb from "@/lib/mongodb";
import Wallet from "@/models/wallet";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

interface IWallet {
    public: string;
    private: string;
    address: string;
    network: string;
}

export async function GET(request: Request) {
    // Get user session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mnemonic = searchParams.get('mnemonic');
    const network = searchParams.get('network');
    const walletNum = searchParams.get('walletNum');
    const sol_hd_path = `m/44'/501'/${walletNum}'/0'`;

    if (mnemonic) {
        if (network === 'sol') {
            const seed = await mnemonicToSeed(mnemonic);
            const derivedSeed = derivePath(sol_hd_path, seed.toString("hex")).key;
            const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
            const privateKey = Buffer.from(secret).toString("hex");
            const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
            const response = { private: privateKey, public: publicKey, address: publicKey };
            return NextResponse.json(response, { status: 200 });
        }
    }
}

export async function POST(request: Request) {
    // Get user session
    const session = await getServerSession(authOptions);

    // Check if the user is authenticated
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userEmail, name, mnemonic, wallets } = await request.json();

    // Ensure that the authenticated user's email matches the userEmail in the request
    if (session.user.email !== userEmail) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectMongoDb();

    const existingWallets = await Wallet.findOne({ userEmail });

    if (existingWallets) {
        const newWallets = [...existingWallets.wallets, ...wallets];
        const doc = { userEmail, name, mnemonic, wallets: newWallets };
        await Wallet.findOneAndUpdate({ userEmail }, doc);
    } else {
        await Wallet.create({ userEmail, name, mnemonic, wallets });
    }

    return NextResponse.json({ "status": "success" }, { status: 201 });
}
