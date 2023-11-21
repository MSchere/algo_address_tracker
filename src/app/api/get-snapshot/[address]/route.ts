import { WalletAddressSchema } from "$lib/zod.schemas";
import { serialize } from "$src/lib/utils/utils";
import { WalletSnapshotsRepository } from "$src/lib/wallet-snapshots/wallet-snapshots.repository";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
    const address = req.nextUrl.toString().split("/").pop();
    const validatedAddress = WalletAddressSchema.safeParse(address);
    if (!validatedAddress.success) {
        return NextResponse.json(
            {
                ok: false,
                error: "Invalid wallet address format",
            }
        )
    }
    // Get latest wallet snapshot
    const snapshot = await WalletSnapshotsRepository.getLatestWalletSnapshot(validatedAddress.data);
    if (!snapshot) {
        return NextResponse.json(
            {
                ok: false,
                error: "Wallet snapshot not found",
            }
        )
    }

    return NextResponse.json(
        {
            ok: true,
            data: serialize(snapshot),
        }
    )
}
