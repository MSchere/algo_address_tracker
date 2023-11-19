"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { type AlgoNodeAccount } from "$lib/types/algonode.types";
import { serialize } from "$lib/utils";
import { type Wallet } from "@prisma/client";
import { WalletsRepository } from "../wallet.repository";

export async function updateAllBalancesAction(): Promise<ActionResponse> {
    try {
        const wallets = await WalletsRepository.getAllWallets();
        if (wallets.length < 1) {
            return {
                success: false,
                errorMessage: "No wallets found",
            };
        }
        const updatedWallets: Wallet[] = [];
        for (const wallet of wallets) {
            const walletAddress = wallet.address;
            const response = (await (
                await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${walletAddress}`)
            )?.json()) as AlgoNodeAccount;
            if (!response) {
                console.error(`Error fetching wallet ${walletAddress} balance`);
                continue;
            }
            const newBalance = response.amount;
            if (newBalance.toString() === wallet.balance.toString()) {
                console.info(`Wallet ${walletAddress} balance has not changed`);
                continue;
            }
            console.info(`Wallet ${walletAddress} balance: ${wallet.balance} -> ${newBalance}`);
            const updatedWallet = await WalletsRepository.updateBalance(walletAddress, newBalance);
            if (!updatedWallet) {
                console.error(`Error updating wallet ${walletAddress} balance`);
                continue;
            }
            updatedWallets.push(updatedWallet);
        }
        return {
            success: true,
            data: serialize(updatedWallets),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: "Error updating wallet balances",
        };
    }
}
