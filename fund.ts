import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

async function fundWallet() {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const pubkey = new PublicKey('BgpTkU2YVazAhBvbBxBgMncZ7kAaTXRFvygv7GQqbUgA');

    try {
        let balance = await connection.getBalance(pubkey);
        console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);

        while (balance < 5 * LAMPORTS_PER_SOL) {
            console.log('Requesting 1 SOL airdrop...');
            try {
                const signature = await connection.requestAirdrop(pubkey, 1 * LAMPORTS_PER_SOL);

                console.log('Confirming transaction...', signature);
                const latestBlockHash = await connection.getLatestBlockhash();
                await connection.confirmTransaction({
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature: signature,
                });

                balance = await connection.getBalance(pubkey);
                console.log(`New balance: ${balance / LAMPORTS_PER_SOL} SOL`);
            } catch (innerErr: any) {
                console.log("Airdrop failed, testing 0.5 SOL...");
                try {
                    const sig2 = await connection.requestAirdrop(pubkey, 0.5 * LAMPORTS_PER_SOL);
                    console.log('Confirming transaction for 0.5 SOL...', sig2);
                    const bh2 = await connection.getLatestBlockhash();
                    await connection.confirmTransaction({
                        blockhash: bh2.blockhash,
                        lastValidBlockHeight: bh2.lastValidBlockHeight,
                        signature: sig2,
                    });
                    balance = await connection.getBalance(pubkey);
                    console.log(`New balance: ${balance / LAMPORTS_PER_SOL} SOL`);
                } catch (err3: any) {
                    console.error("Even 0.5 dropped failed.", err3.message);
                    break;
                }
            }

            // Wait to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log('Wallet funding attempt finished. Final balance:', balance / LAMPORTS_PER_SOL);
    } catch (error) {
        console.error('Error funding wallet totally:', error);
    }
}

fundWallet();
