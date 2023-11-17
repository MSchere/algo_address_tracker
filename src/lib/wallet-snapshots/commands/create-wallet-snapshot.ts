import { type ActionResponse } from "$src/lib/types/action.types";
import { WalletsRepository } from "$src/lib/wallet/wallet.repository";
import { WalletSnapshotsRepository } from "../wallet-snapshots.repository";

export async function createWalletSnapshotAction(walletAddress: string): Promise<ActionResponse> {
    const wallet = await WalletsRepository.getWallet(walletAddress);
    if (!wallet) {
        return {
            success: false,
            errorMessage: "Wallet not found",
        };
    }
    const walletSnapshot = await WalletSnapshotsRepository.createWalletSnapshot(walletAddress, wallet.balance);
    if (!walletSnapshot) {
        return {
            success: false,
            errorMessage: "Error creating wallet snapshot",
        };
    }
    return {
        success: true,
        data: `Created wallet snapshot ${walletSnapshot.id}`
    };
}