export type WalletStatus = {
    address: string;
    balance: bigint;
    minutelyChange: number;
    hourlyChange: number;
    dailyChange: number;
    updatedAt: Date;
};

export type EventData = {
    type: string;
    data: string;
};
