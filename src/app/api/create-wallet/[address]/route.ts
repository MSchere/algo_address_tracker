import { createWalletSnapshotAction } from "$src/lib/wallet-snapshots/commands/create-wallet-snapshot";
import { createWalletAction } from "$src/lib/wallet/commands/create-wallet";
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
    // Create wallet and get balance from AlgoNode API
    const res0 = await createWalletAction(validatedAddress.data);
    if (!res0.success) {
        return NextResponse.json(
            {
                ok: false,
                error: res0.errorMessage,
            }
        )
    }
    // Wallet created successfully, create a wallet snapshot
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
            data: res0.data,
        }
    )
}
