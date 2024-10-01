import { generateMnemonic } from "bip39";
import { NextResponse } from "next/server";


export async function  GET(request: Request) {
    
    console.log(request)
    const mn = await generateMnemonic();

    return NextResponse.json({mnemonic:mn}, {status:200})
    
}