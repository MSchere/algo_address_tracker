import { WalletSnapshotsRepository } from "$lib/wallet-snapshots/wallet-snapshots.repository";
import { WalletsRepository } from "$lib/wallet/wallet.repository";
import RealTimeWallets from "./RealTimeWallets";

export default async function WalletTracker() {
    const allWallets = await WalletsRepository.getAllWallets() ?? [];
    const latestWalletSnapshots = await WalletSnapshotsRepository.getLatestWalletSnapshotsForWallets(allWallets) ?? [];
    return <RealTimeWallets initialRows={latestWalletSnapshots} />;
}
