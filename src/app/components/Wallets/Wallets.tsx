import { type WalletStatus } from "$src/lib/types/wallet.types";
import { WalletSnapshotsRepository } from "$src/lib/wallet-snapshots/wallet-snapshots.repository";
import RealTimeBalances from "./RealTimeBalances";

export default async function Wallets() {
    const latestWalletSnapshots = await WalletSnapshotsRepository.getLatestWalletSnapshots();
    const initialWalletStatuses: WalletStatus[] = [];
    if (latestWalletSnapshots) {
        for (const snapshot of latestWalletSnapshots) {
            initialWalletStatuses.push({
                address: snapshot.walletAddress,
                balance: snapshot.balance,
                minutelyChange: 0,
                hourlyChange: 0,
                dailyChange: 0,
                updatedAt: snapshot.createdAt,
            });
        }
    }
    return <RealTimeBalances initialRows={initialWalletStatuses} />;
}
