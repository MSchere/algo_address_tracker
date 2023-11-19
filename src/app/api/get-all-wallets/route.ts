import { getAllWalletsAction } from "$src/lib/wallet/queries/get-all-wallets";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    const res = await getAllWalletsAction();
    if (!res.success) {
        return NextResponse.json({
            ok: false,
            error: res.errorMessage,
        });
    }

    return NextResponse.json({
        ok: true,
        data: res.data,
    });
}
