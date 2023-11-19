"use client";

import { env } from "$src/env.mjs";
import { type WalletStatus } from "$src/lib/types/wallet.types";
import { EventDataSchema, WalletStatusesArraySchema } from "$src/lib/zod.schemas";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import WalletsTable from "./WalletsTable";

enum SocketEvents {
    balanceUpdated = "balance-updated",
}

interface Props {
    initialRows: WalletStatus[];
}

export default function RealTimeBalances({ initialRows: initialRankingEntries }: Props) {
    const [walletStatuses, setWalletStatuses] = useState<WalletStatus[]>(initialRankingEntries);
    const { lastMessage, readyState } = useWebSocket(env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL);

    useEffect(() => {
        setWalletStatuses(initialRankingEntries); //to refresh the table when new data is fetched
    }, [initialRankingEntries]);

    useEffect(() => {
        try {
            if (!readyState) return;
            if (lastMessage === null) return;

            const event = EventDataSchema.parse(JSON.parse(lastMessage.data as string));
            if (event.type !== `${SocketEvents.balanceUpdated}`) return;

            const validatedWalletStatuses = WalletStatusesArraySchema.parse(JSON.parse(event.data));
            console.info("Received data through websocket: ", validatedWalletStatuses);
            setWalletStatuses(validatedWalletStatuses);
        } catch (err: unknown) {
            console.error("Websocket error", err);
        }
    }, [lastMessage, readyState, walletStatuses]);

    return <WalletsTable walletStatuses={walletStatuses} />;
}
