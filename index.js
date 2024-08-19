const { Helius } = require("helius-sdk");
const { Transaction, Keypair } = require("@solana/web3.js");
require("dotenv").config();

const payloadBase64 = process.env.TRANSACTION_PAYLOAD;

const oldTx = Transaction.from(Buffer.from(payloadBase64, "base64"));
const instructions = oldTx.instructions;

// Get all instructions where programId is not 11111111111111111111111111111111
const nonSystemInstructions = instructions.filter(
  (instruction) =>
    instruction.programId.toString() !== "11111111111111111111111111111111"
);

// print the instructions
for (const instruction of nonSystemInstructions) {
  const dataBuffer = instruction.data;

  // Ensure the instruction is a SystemProgram transfer
  let sol = 0;
  if (
    instruction.programId.toString() === "11111111111111111111111111111111" &&
    dataBuffer.length === 12
  ) {
    const lamports = dataBuffer.readBigInt64LE(4);
    sol = Number(lamports) / 1e9;
    console.log(`Transfer of ${lamports} lamports (${sol} SOL)`);
  }

  console.log("Instruction:", {
    keys: instruction.keys.map((key) => key.pubkey.toString()),
    programId: instruction.programId.toString(),
    data: instruction.data.toString("base64"),
    solTransfered: sol,
  });
}

// Sign with private key
const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY);
const privateKey = Uint8Array.from(privateKeyArray);
const signer = Keypair.fromSecretKey(privateKey);

// Send transaction
async function sendTransaction() {
  const helius = new Helius(process.env.HELIUS_API_KEY);

  // create a new transaction from the nonSystemInstructions
  const tx = new Transaction().add(...nonSystemInstructions);

  // get recent blockhash
  const blockhash = (await helius.connection.getLatestBlockhash()).blockhash;
  tx.recentBlockhash = blockhash;

  tx.sign(signer);

  try {
    const signature = await helius.connection.sendRawTransaction(
      tx.serialize()
    );
    console.log("Transaction sent. Signature:", signature);

    // Wait for confirmation
    await helius.connection.confirmTransaction(signature);
    console.log("Transaction confirmed");
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

sendTransaction();
