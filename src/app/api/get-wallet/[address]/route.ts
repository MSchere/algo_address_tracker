import { getWalletAction } from "$src/lib/wallet/queries/get-wallet";
import { WalletAddressSchema } from "$src/lib/zod.schemas";
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
    const res = await getWalletAction(validatedAddress.data);
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
