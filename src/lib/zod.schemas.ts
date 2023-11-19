import { z } from "zod";
import { type WalletStatus } from "./types/wallet.types";

// zod schema for validating an Algorand addres (example: TIBGRAR2MGJHMIAWW7S26KIKUJA6NVIHDD6GYNODU67HPTKR5FALC7ASCA)
export const WalletAddressSchema = z.string().regex(/^([A-Z0-9]{58})$/);

export const WalletStatusSchema: z.ZodSchema<WalletStatus> = z.object({
    address: WalletAddressSchema,
    balance: z.bigint(),
    minutelyChange: z.number(),
    hourlyChange: z.number(),
    dailyChange: z.number(),
    updatedAt: z.date(),
});

export const WalletStatusesArraySchema = z.array(WalletStatusSchema);

export const EventDataSchema = z.object({
    type: z.string(),
    data: z.string(),
});
