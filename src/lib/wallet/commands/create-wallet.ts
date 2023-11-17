"use server";

import { type ActionResponse } from "$src/lib/types/action.types";
import { type AlgoNodeAccount } from "$src/lib/types/algonode.types";
import { WalletAddressSchema } from "$src/lib/zod.schemas";
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
        //GET response from balance endpoint

        const response = await (await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${walletAddress}`))?.json() as AlgoNodeAccount;
        if (!response) {
            return {
                success: false,
                errorMessage: "AlgoNode API error",
            };
        }
        const initialBalance = response.amount;
        //Create wallet
        const wallet = await WalletsRepository.createWallet(walletAddress, initialBalance);
        if (!wallet) {
            return {
                success: false,
                errorMessage: "Error creating wallet, wallet already exists",
            };
        }
        return { success: true, data: `Created wallet ${wallet.address}` };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errorMessage: `Error creating wallet`,
        };
    }
}
