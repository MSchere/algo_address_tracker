"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { getAlgoNodeWalletBalance } from "$src/lib/utils/algonode.utils";
import { WalletsRepository } from "../wallet.repository";

export async function updateBalanceAction(walletAddress: string): Promise<ActionResponse> {
    try {
        const validatedAddress = WalletAddressSchema.safeParse(walletAddress);
        if (!validatedAddress.success) {
            return {
                success: false,
                errorMessage: "Invalid wallet address format",
            };
        }
        const wallet = await WalletsRepository.getWallet(walletAddress);
        if (!wallet) {
            return {
                success: false,
                errorMessage: "Wallet not found",
            };
        }
        //Get balance from Algonode endpoint
        const response = await getAlgoNodeWalletBalance(walletAddress);
        if (!response) {
            return {
                success: false,
                errorMessage: `Failed to fetch balance for wallet ${walletAddress} after all retries`,
            }
        }
        if (response.message === "failed to parse the address") {
            return {
                success: false,
                errorMessage: "Wallet does not exist",
            };
        }

        const newBalance = response.amount;
        if (newBalance.toString() === wallet.balance.toString()) {
            console.log(`Wallet ${walletAddress} balance has not changed`);
            return {
                success: false,
                errorMessage: `Wallet ${walletAddress} balance has not changed`,
            };
        }
        console.info(`Wallet ${walletAddress} balance: ${wallet.balance} -> ${newBalance}`);
        const updatedWallet = await WalletsRepository.updateBalance(walletAddress, newBalance);
        if (!updatedWallet) {
            return {
                success: false,
                errorMessage: "Error updating wallet balance",
            };
        }
        return {
            success: true,
            data: `Updated wallet ${walletAddress} balance to ${updatedWallet.balance}`,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: "Error updating wallet balance",
        };
    }
}
