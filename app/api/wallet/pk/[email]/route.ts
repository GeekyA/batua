import connectMongoDb from "@/lib/mongodb";
import Wallet from "@/models/wallet";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";

export async function GET(request: Request, { params }: { params: { email: string } }) {
  await connectMongoDb();

  // Get user session
  const session = await getServerSession(authOptions);

  // Check if the user is authenticated
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = params;

  // Ensure that the authenticated user's email matches the requested email
  if (session.user.email !== email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse the URL to extract query parameters
  const { searchParams } = new URL(request.url);
  console.log("Search params", searchParams)
  const publicKey = searchParams.get('publicKey');

  // Check if publicKey is provided
  if (!publicKey) {
    return NextResponse.json({ error: "publicKey parameter is required" }, { status: 400 });
  }

  // Fetch the wallet associated with the requested email
  const wallet = await Wallet.findOne({ userEmail: email });

  if (!wallet) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  // Find the wallet that matches the provided publicKey
  const matchingWallet = wallet.wallets.find((w: { public: string; private: string }) => w.public === publicKey);

  if (matchingWallet) {
    return NextResponse.json({ privateKey: matchingWallet.private }, { status: 200 });
  }

  // Return error if publicKey is not found
  return NextResponse.json({ error: "Public key not found" }, { status: 404 });
}
