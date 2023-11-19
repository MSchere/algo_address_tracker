"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { type AlgoNodeAccount } from "$lib/types/algonode.types";
import { WalletAddressSchema } from "$lib/zod.schemas";
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
        const response = await (
            await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${walletAddress}`)
        )?.json() as AlgoNodeAccount;
        if (!response) {
            return {
                success: false,
                errorMessage: "AlgoNode API error",
            };
        }
        const newBalance = response.amount;
        if (newBalance.toString() === wallet.balance.toString()) {
            console.info(`Wallet ${walletAddress} balance has not changed`);
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
