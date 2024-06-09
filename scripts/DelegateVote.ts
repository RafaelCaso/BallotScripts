import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { 
  createPublicClient, 
  http, 
  createWalletClient 
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();

const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const delegatePrivateKey = process.env.PRIVATE_KEY_2 || "";

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  
  const chairAccount = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const chairClient = createWalletClient({
    account: chairAccount,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const delegateAccount = privateKeyToAccount(`0x${delegatePrivateKey}`);
  const delegateClient = createWalletClient({
    account: delegateAccount,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const hash = await delegateClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "delegate",
    args: [chairClient.account.address],
  });

  console.log("Transaction hash:", hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
