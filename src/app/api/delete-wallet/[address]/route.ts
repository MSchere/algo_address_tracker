import { deleteWalletAction } from "$lib/wallet/commands/delete-wallet";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(req: NextRequest): Promise<NextResponse> {
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
    const res = await deleteWalletAction(validatedAddress.data);
    if (!res.success) {
        return NextResponse.json(
            {
                ok: false,
                error: res.errorMessage,
            }
        )
    }
    return NextResponse.json(
        {
            ok: true,
            data: res.data,
        }
    )
}