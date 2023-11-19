"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { type AlgoNodeAccount } from "$lib/types/algonode.types";
import { WalletAddressSchema } from "$lib/zod.schemas";
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
        const response = await (await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${walletAddress}`))?.json() as AlgoNodeAccount;
        if (!response) {
            return {
                success: false,
                errorMessage: "AlgoNode API error",
            };
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
