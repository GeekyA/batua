import {
    Connection,
    PublicKey,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';
  
  /**
   * Sends SOL from one address to another
   * 
   * @param senderKeypair - The Keypair of the sender's wallet
   * @param recipientAddress - The PublicKey of the recipient's wallet
   * @param amountInSOL - The amount to send in SOL (not lamports)
   * @returns The transaction signature as a string
   */
  async function sendSol(
    senderKeypair: Keypair, 
    recipientAddress: string, 
    amountInSOL: number
  ): Promise<string> {
    // Connect to the Solana cluster (mainnet, testnet, or devnet)
    const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed'); // Use 'mainnet-beta' for mainnet
  
    // Convert the recipient's address into a PublicKey object
    const recipientPubKey = new PublicKey(recipientAddress);
  
    // Convert SOL to lamports (1 SOL = 1e9 lamports)
    const amountInLamports = amountInSOL * LAMPORTS_PER_SOL;
  
    // Create a transaction to transfer SOL
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipientPubKey,
        lamports: amountInLamports,
      })
    );
  
    // Send the transaction and confirm it
    const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
  
    console.log('Transaction successful with signature:', signature);
    return signature;
  }
  