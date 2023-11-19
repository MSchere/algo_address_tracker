import { serialize } from "$src/lib/utils";
import { WalletSnapshotsRepository } from "$src/lib/wallet-snapshots/wallet-snapshots.repository";
import { WalletsRepository } from "$src/lib/wallet/wallet.repository";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    const allWallets = await WalletsRepository.getAllWallets() ?? [];
    // Get latest wallet snapshots
    const latestWalletSnapshots = await WalletSnapshotsRepository.getLatestWalletSnapshotsForWallets(allWallets) ?? [];
    return NextResponse.json(
        {
            ok: true,
            data: serialize(latestWalletSnapshots),
        }
    )
}
