
import { SocketEvents } from "$lib/types/websocket.types";
import { deserialize } from "$lib/utils/utils";
import { sendMessageThroughWebsocket } from "$lib/utils/websocket.utils";
import { createManyWalletSnapshotsAction } from "$lib/wallet-snapshots/commands/create-many-wallet-snapshots";
import { updateAllBalancesAction } from "$lib/wallet/commands/update-all-balances";
import { type Wallet } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PUT(): Promise<NextResponse> {

    // Update wallet balances from AlgoNode API
    const res0 = await updateAllBalancesAction();
    if (!res0.success) {
        return NextResponse.json(
            {
                ok: false,
                error: res0.errorMessage,
            }
        )
    }
    const updatedWallets = deserialize<Wallet[]>(res0.data);
    // Balances updated successfully, create wallet snapshots
    const res1 = await createManyWalletSnapshotsAction(updatedWallets);
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
