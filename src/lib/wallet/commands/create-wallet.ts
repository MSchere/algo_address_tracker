"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { getAlgoNodeWalletBalance } from "$src/lib/utils/algonode.utils";
import { WalletsRepository } from "../wallet.repository";

export async function createWalletAction(walletAddress: string): Promise<ActionResponse> {
    try {
        const validatedAddress = WalletAddressSchema.safeParse(walletAddress);
        if (!validatedAddress.success) {
            return {
                success: false,
                errorMessage: "Invalid wallet address format",
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

        const initialBalance = response.amount;
        //Create wallet
        const wallet = await WalletsRepository.createWallet(walletAddress, initialBalance);
        if (!wallet) {
            return {
                success: false,
                errorMessage: "Error adding wallet, wallet is already tracked",
            };
        }
        return { success: true, data: `Now tracking wallet ${wallet.address}` };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: `Error adding wallet`,
        };
    }
}
