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

  const userEmail = params.email;

  // Optional: Ensure that the authenticated user's email matches the requested email
  if (session.user.email !== userEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch the wallet associated with the requested email
  const wallet = await Wallet.findOne({ userEmail });

  if (wallet) {
    return NextResponse.json(wallet, { status: 200 });
  }
  return NextResponse.json(null, { status: 200 });
}
