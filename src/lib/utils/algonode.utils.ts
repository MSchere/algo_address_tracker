import { type AlgoNodeAccount } from "../types/algonode.types";

//Exponential backoff function in case we get rate-limited
export async function getAlgoNodeWalletBalance(walletAddress: string) {
    let delay = 1000;
    let response: AlgoNodeAccount | undefined;
    for (let i = 0; i < 5; i++) {
        response = (await (
            await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${walletAddress}`)
        )?.json()) as AlgoNodeAccount;
        if (!response) {
            console.error(`Error fetching wallet ${walletAddress} balance, retrying in ${delay}`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // Double the delay
            continue;
        }
     break;
    }
    return response;
}