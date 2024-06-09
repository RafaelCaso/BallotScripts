import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import { 
  createPublicClient, 
  http, 
  createWalletClient, 
  formatEther, 
  toHex, 
  hexToString 
  } from "viem";
  import { sepolia } from "viem/chains";
  import * as dotenv from "dotenv";
  dotenv.config();
  
  const providerApiKey = process.env.ALCHEMY_API_KEY || "";
  
  async function main() {
    //1. make public account
    const hardcodedBallotContract = "0x85796a059d06aafc0eb74a48a8b1a36a1e395bbe";
    
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
      });
      //2. use public account to winnerNamer()

      const winnerHexName = (await publicClient.readContract({
        address: hardcodedBallotContract,
        abi,
        functionName: "winnerName",
        args: [],
      })) as `0x${string}`;

      console.log({winnerHexName});

      //3. convert the response of winnerName() back to string from hex

      const winningPropsal = hexToString(winnerHexName, {size: 32})

      console.log({winningPropsal})
}

async function main2() {
  //1. make public account
  const hardcodedBallotContract = "0x85796a059d06aafc0eb74a48a8b1a36a1e395bbe";
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    //2. use public account to winnerNamer()

    const proposal3 = (await publicClient.readContract({
      address: hardcodedBallotContract,
      abi,
      functionName: "proposals",
      args: [2n],
    })) as any[any];

    // console.log({winnerHexName});

    //3. convert the response of winnerName() back to string from hex

    console.log('this number should be three:', proposal3[1])
}

async function main3() {
  //1. make public account
  const hardcodedBallotContract = "0x85796a059d06aafc0eb74a48a8b1a36a1e395bbe";
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    //2. use public account to winnerNamer()

    const chairAddress = (await publicClient.readContract({
      address: hardcodedBallotContract,
      abi,
      functionName: "chairperson",
      args: [],
    })) as `0x${string}`;

    // console.log({winnerHexName});

    //3. convert the response of winnerName() back to string from hex

    console.log({chairAddress})
    console.log('should show that chair address retreived is same as hardcoded:', '0xd1B41bE30F980315b8A6b754754aAa299C7abea2' === chairAddress)
}

main3().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});