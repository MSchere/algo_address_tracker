"use server";

import { type ActionResponse } from "$lib/types/action.types";
import { parseBalance, serialize } from "$lib/utils";
import { WalletsRepository } from "$lib/wallet/wallet.repository";
import { WalletSnapshotsRepository } from "../wallet-snapshots.repository";

export async function createWalletSnapshotAction(walletAddress: string): Promise<ActionResponse> {
    const wallet = await WalletsRepository.getWallet(walletAddress);
    if (!wallet) {
        return {
            success: false,
            errorMessage: "Wallet not found",
        };
    }
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const latestMinutelySnapshot = await WalletSnapshotsRepository.getLatestWalletSnapshotBefore(
        wallet.address,
        new Date(oneMinuteAgo)
    );
    const latestHourlySnapshot = await WalletSnapshotsRepository.getLatestWalletSnapshotBefore(
        wallet.address,
        new Date(oneHourAgo)
    );
    const latestDailySnapshot = await WalletSnapshotsRepository.getLatestWalletSnapshotBefore(
        wallet.address,
        new Date(oneDayAgo)
    );
    const balance = parseBalance(wallet.balance);
    const minutelySnapshotBalance = latestMinutelySnapshot ? parseBalance(latestMinutelySnapshot.balance) : 0;
    const hourlySnapshotBalance = latestHourlySnapshot ? parseBalance(latestHourlySnapshot.balance) : 0;
    const dailySnapshotBalance = latestDailySnapshot ? parseBalance(latestDailySnapshot.balance) : 0;
    const minutelyChange =
        !minutelySnapshotBalance || wallet.updatedAt.getTime() < oneMinuteAgo.getTime()
            ? 0
            : ((balance - minutelySnapshotBalance) / minutelySnapshotBalance) * 100;
    const hourlyChange =
        !hourlySnapshotBalance || wallet.updatedAt.getTime() < oneHourAgo.getTime()
            ? 0
            : ((balance - hourlySnapshotBalance) / hourlySnapshotBalance) * 100;
    const dailyChange =
        !dailySnapshotBalance || wallet.updatedAt.getTime() < oneDayAgo.getTime()
            ? 0
            : ((balance - dailySnapshotBalance) / dailySnapshotBalance) * 100;

    console.info("created snapshot", {
        walletAddress,
        balance,
        minutelySnapshotBalance,
        hourlySnapshotBalance,
        dailySnapshotBalance,
        minutelyChange,
        hourlyChange,
        dailyChange,
    });
    const walletSnapshot = await WalletSnapshotsRepository.createWalletSnapshot(wallet, {
        minutely: minutelyChange,
        hourly: hourlyChange,
        daily: dailyChange,
    });
    if (!walletSnapshot) {
        return {
            success: false,
            errorMessage: "Error creating wallet snapshot",
        };
    }
    return {
        success: true,
        data: serialize([walletSnapshot]),
    };
}
