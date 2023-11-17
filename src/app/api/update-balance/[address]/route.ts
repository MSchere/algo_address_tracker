
import { createWalletSnapshotAction } from "$src/lib/wallet-snapshots/commands/create-wallet-snapshot";
import { updateBalanceAction } from "$src/lib/wallet/commands/update-balance";
import { WalletAddressSchema } from "$src/lib/zod.schemas";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
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
    // Update wallet balance from AlgoNode API
    const res0 = await updateBalanceAction(validatedAddress.data);
    if (!res0.success) {
        return NextResponse.json(
            {
                ok: false,
                error: res0.errorMessage,
            }
        )
    }
    // Balance updated successfully, create a wallet snapshot
    const res1 = await createWalletSnapshotAction(validatedAddress.data);
    if (!res1.success) {
        return NextResponse.json(
            {
                ok: false,
                error: res1.errorMessage,
            }
        )
    }
    return NextResponse.json(
        {
            ok: true,
            data: res1.data,
        }
    )
}
