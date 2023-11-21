"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { serialize } from "$lib/utils/utils";
import { getAlgoNodeWalletBalance } from "$src/lib/utils/algonode.utils";
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

            const algoNodeBalance = await getAlgoNodeWalletBalance(wallet.address);
            if (!algoNodeBalance) {
                console.error(`Failed to fetch balance for wallet ${walletAddress} after all retries`);
                continue;
            }

            const newBalance = algoNodeBalance.amount;
            if (newBalance.toString() === wallet.balance.toString()) {
                console.log(`Wallet ${walletAddress} balance has not changed`);
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
