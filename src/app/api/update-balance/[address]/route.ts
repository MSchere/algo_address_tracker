
import { SocketEvents } from "$lib/types/websocket.types";
import { sendMessageThroughWebsocket } from "$lib/utils/websocket.utils";
import { createWalletSnapshotAction } from "$lib/wallet-snapshots/commands/create-wallet-snapshot";
import { updateBalanceAction } from "$lib/wallet/commands/update-balance";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { NextResponse, type NextRequest } from "next/server";

export async function PUT(req: NextRequest): Promise<NextResponse> {
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
    // Send a websocket message to all connected clients
    await sendMessageThroughWebsocket(SocketEvents.balancesUpdated, res1.data);
    return NextResponse.json(
        {
            ok: true,
            data: res1.data,
        }
    )
}
