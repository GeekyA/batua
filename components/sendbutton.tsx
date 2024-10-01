'use client'
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { useState } from "react";
import {
  Keypair,
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { toast } from "react-toastify"; // Optional: Use any notification library you prefer
import { connect } from "http2";

interface SendProps {
  publicKey: string; // Add the sender's public key (Base58 string)
  privateKey: string; // Hexadecimal string
  availableSol: number;
}

export default function SendSol({ publicKey, privateKey, availableSol }: SendProps) {
  const [sending, setSending] = useState(false);
  const [amount, setAmount] = useState(0);
  const [receiverPublicKey, setReceiverPublicKey] = useState<string>("");

  const handleSendSol = async () => {
    setSending(true);
    try {
      // Create a connection to the Solana network (devnet/mainnet/testnet)
      const connection = new Connection("https://docs-demo.solana-mainnet.quiknode.pro", "confirmed");

      // Convert the hexadecimal privateKey to a Keypair
      const secretKey = Uint8Array.from(privateKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const senderKeypair = Keypair.fromSecretKey(secretKey);
      const senderPublicKey = senderKeypair.publicKey.toString();
    console.log("Sender's Public Key:", senderPublicKey);

      // Validate the receiver's public key
      const receiverPublicKeyObj = new PublicKey(receiverPublicKey);

      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderKeypair.publicKey, // Use the sender's public key
          toPubkey: receiverPublicKeyObj,
          lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
        })
      );

      // Send the transaction
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [senderKeypair] // Sign the transaction with sender's keypair
      );

      toast.success(`Transaction successful! Signature: ${signature}`);
    } catch (error) {
      console.log(error)
    } finally {
      setSending(false);
    }
  };
  console.log("private KEY", privateKey)

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={sending}>
            {sending ? "Sending..." : "Send SOL"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send SOL</DialogTitle>
            <DialogDescription>
              Available SOL: {availableSol}
            </DialogDescription>
          </DialogHeader>

          <Label htmlFor="receiverPublicKey">Receiver Public Key</Label>
          <input
            id="receiverPublicKey"
            type="text"
            value={receiverPublicKey}
            onChange={(e) => setReceiverPublicKey(e.target.value)}
            className="input-class" // Adjust the class according to your UI
            placeholder="Enter receiver's public key"
          />

          <Label htmlFor="amount">Amount (SOL)</Label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input-class" // Adjust the class according to your UI
            min="0"
            max={availableSol}
          />

          <Button onClick={handleSendSol} disabled={sending || amount <= 0 || amount > availableSol || !receiverPublicKey}>
            {sending ? "Sending..." : "Confirm"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
