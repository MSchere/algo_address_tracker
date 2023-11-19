"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { serialize } from "$src/lib/utils";
import { WalletsRepository } from "../wallet.repository";

export async function getAllWalletsAction(): Promise<ActionResponse> {
    try {
        const wallets = await WalletsRepository.getAllWallets();
        if (!wallets) {
            return {
                success: false,
                errorMessage: "Wallets not found",
            };
        }
        return {
            success: true,
            data: serialize(wallets),
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: "Error getting wallets",
        };
    }
}
