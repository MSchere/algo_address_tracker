"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { serialize } from "$src/lib/utils/utils";
import { WalletsRepository } from "../wallet.repository";

export async function getWalletAction(walletAddress: string): Promise<ActionResponse> {
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
        return {
            success: true,
            data: serialize(wallet),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: "Error getting wallet",
        };
    }
}