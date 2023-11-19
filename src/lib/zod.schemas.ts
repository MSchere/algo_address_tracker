import { z } from "zod";

// zod schema for validating an Algorand addres (example: TIBGRAR2MGJHMIAWW7S26KIKUJA6NVIHDD6GYNODU67HPTKR5FALC7ASCA)
export const WalletAddressSchema = z.string().regex(/^([A-Z0-9]{58})$/);

export const EventDataSchema = z.object({
    type: z.string(),
    data: z.string(),
});
