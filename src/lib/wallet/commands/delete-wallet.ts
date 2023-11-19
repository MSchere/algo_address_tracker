"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { WalletsRepository } from "../wallet.repository";

export async function deleteWalletAction(walletAddress: string): Promise<ActionResponse>  {
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
        const deletedWallet = await WalletsRepository.deleteWallet(walletAddress);
        if (!deletedWallet) {
            return {
                success: false,
                errorMessage: "Error deleting wallet",
            };
        }
        return {
            success: true,
            data: `Deleted wallet ${walletAddress}`,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: "Error deleting wallet",
        };
    }
}

