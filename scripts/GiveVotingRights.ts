import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { 
  http, 
  createWalletClient
} from "viem";

import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function main() {
  // discard first two parameters
  const parameters = process.argv.slice(2);
  // check if parameters are provided
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  // get contract address and voter address
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const voter = parameters[1];
  if (!voter) throw new Error("Voter address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(voter))
    throw new Error("Invalid voter address");

  // I think 'voterClient' is wrong, I think this is the deployer's account which is then used to give voting rights to the voter address
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const voterClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const hash = await voterClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "giveRightToVote",
    args: [voter],
  });
  console.log("Transaction hash:", hash);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});