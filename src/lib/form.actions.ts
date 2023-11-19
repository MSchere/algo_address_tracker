"use server";

import { revalidatePath } from "next/cache";
import { type ActionResponse } from "./types/action.types";
import { createWalletSnapshotAction } from "./wallet-snapshots/commands/create-wallet-snapshot";
import { createWalletAction } from "./wallet/commands/create-wallet";
import { WalletAddressSchema } from "./zod.schemas";

export async function submitAddressAction(prevState: unknown, formData: FormData): Promise<ActionResponse> {
    try {
        const formAddress = formData.get("address");
        const validatedAddress = WalletAddressSchema.safeParse(formAddress);
        if (!validatedAddress.success) {
            return { success: false, errorMessage: "Invalid address format" };
        }
        // Create wallet and get balance from AlgoNode API
        const res0 = await createWalletAction(validatedAddress.data);
        if (!res0.success) {
            return res0;
        }
        // Wallet created successfully, create a wallet snapshot
        const res1 = await createWalletSnapshotAction(validatedAddress.data);
        if (res1.success) revalidatePath("/");
        
        return res1;
    } catch (error) {
        console.error(error);
        return { success: false, errorMessage: "Invalid address" };
    }
}
