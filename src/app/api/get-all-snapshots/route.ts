import { serialize } from "$src/lib/utils";
import { WalletSnapshotsRepository } from "$src/lib/wallet-snapshots/wallet-snapshots.repository";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    // Get all wallet snapshots
    const allWalletSnapshots = await WalletSnapshotsRepository.getAllWalletSnapshots();
    return NextResponse.json(
        {
            ok: true,
            data: serialize(allWalletSnapshots),
        }
    )
}
