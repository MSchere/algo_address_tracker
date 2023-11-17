import { type ActionResponse } from "$src/lib/types/action.types";
import { WalletAddressSchema } from "$src/lib/zod.schemas";
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
            data: JSON.stringify(wallet),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: "Error getting wallet",
        };
    }
}