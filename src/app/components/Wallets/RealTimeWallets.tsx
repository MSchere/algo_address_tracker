"use client";

import { SocketEvents } from "$lib/types/websocket.types";
import { deserialize } from "$lib/utils/utils";
import { EventDataSchema } from "$lib/zod.schemas";
import { env } from "$src/env.mjs";
import { type WalletSnapshot } from "@prisma/client";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import WalletsTable from "./WalletsTable";

interface Props {
    initialRows: WalletSnapshot[];
}

export default function RealTimeWallets({ initialRows: initialRankingEntries }: Props) {
    const [walletSnapshots, setWalletSnapshots] = useState<WalletSnapshot[]>(initialRankingEntries);
    const { lastMessage, readyState } = useWebSocket(env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL);

    useEffect(() => {
        setWalletSnapshots(initialRankingEntries); //to refresh the table when new data is fetched
    }, [initialRankingEntries]);

    useEffect(() => {
        try {
            if (!readyState) return;
            if (lastMessage === null) return;

            const event = EventDataSchema.parse(JSON.parse(lastMessage.data as string));
            if (event.type !== `${SocketEvents.balancesUpdated}`) return;
            console.log("Received event through websocket: ", event);
            const socketWalletSnapshots = deserialize<WalletSnapshot[]>(event.data);
            // update only the wallets that have changed
            const updatedWalletSnapshots = walletSnapshots.map((walletSnapshot) => {
                const updatedWalletSnapshot = socketWalletSnapshots.find(
                    (snapshot) => snapshot.walletAddress === walletSnapshot.walletAddress
                );
                return updatedWalletSnapshot ?? walletSnapshot;
            });
            updatedWalletSnapshots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            setWalletSnapshots(updatedWalletSnapshots);
        } catch (err: unknown) {
            console.error("Websocket error", err);
        }
    }, [lastMessage, readyState]);

    return <WalletsTable WalletSnapshots={walletSnapshots} />;
}
