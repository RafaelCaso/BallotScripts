import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { 
  createPublicClient, 
  http, 
  createWalletClient, 
  formatEther, 
  toHex, 
  hexToString 
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  // remove the first two arguments (node and script name)
  const parameters = process.argv.slice(2);
  // ensure at least 2 parameters are provided
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  // check that the contract address is valid using regex
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  // get the proposal index and check if it is a number.
  const proposalIndex = parameters[1];
  if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");
  
  // create public client which is used to read from the blockchain (pure and views methods)
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });


  console.log("Proposal selected: ");
  // read the proposal from the contract using the argument passed as proposal index
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "proposals",
    args: [BigInt(proposalIndex)],
  })) as any[];
  // print the name of the proposal
  const name = hexToString(proposal[0], { size: 32 });
  console.log("Voting to proposal", name);
  console.log("Confirm? (Y/n)");

  // create a wallet client which can be used to write to the blockchain
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const voter = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // cast vote
      const hash = await voter.writeContract({
        address: contractAddress,
        abi,
        functionName: "vote",
        args: [BigInt(proposalIndex)],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      
      // ???? checking that the transaction is written to the chain ????
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("Transaction confirmed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});