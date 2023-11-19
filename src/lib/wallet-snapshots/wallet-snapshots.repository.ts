import { type Wallet, type WalletSnapshot } from "@prisma/client";
import { prisma } from "../prisma";

export class WalletSnapshotsRepository {
    static async createWalletSnapshot(
        wallet: Wallet,
        percentageChanges: { minutely: number; hourly: number; daily: number }
    ): Promise<WalletSnapshot | null> {
        const id = `${wallet.address.substring(0, 8)}-${wallet.updatedAt.getTime()}`;
        const walletSnapshot = await prisma.walletSnapshot.create({
            data: {
                id,
                createdAt: wallet.updatedAt,
                walletAddress: wallet.address,
                balance: wallet.balance,
                minutelyChange: percentageChanges.minutely,
                hourlyChange: percentageChanges.hourly,
                dailyChange: percentageChanges.daily,
            },
        });
        return walletSnapshot;
    }

    static async getWalletSnapshots(walletAddress: string): Promise<WalletSnapshot[]> {
        const walletSnapshots = await prisma.walletSnapshot.findMany({
            where: { walletAddress },
        });
        return walletSnapshots;
    }

    static async getLatestWalletSnapshot(walletAddress: string): Promise<WalletSnapshot | null> {
        const walletSnapshot = await prisma.walletSnapshot.findFirst({
            where: { walletAddress },
            orderBy: { createdAt: "desc" },
        });
        return walletSnapshot;
    }

    static async getLatestWalletSnapshotBefore(walletAddress: string, before: Date): Promise<WalletSnapshot | null> {
        const walletSnapshot = await prisma.walletSnapshot.findFirst({
            where: { walletAddress, createdAt: { lt: before } },
            orderBy: { createdAt: "desc" },
        });
        return walletSnapshot;
    }

    static async getLatestWalletSnapshotsForWallets(wallets: Wallet[]): Promise<WalletSnapshot[] | null> {
        const ids = wallets.map((wallet) => `${wallet.address.substring(0, 8)}-${wallet.updatedAt.getTime()}`);
        const walletSnapshots = await prisma.walletSnapshot.findMany({
            where: { id: { in: ids } },
            orderBy: { createdAt: "desc" },
        });
        return walletSnapshots;
        

    }
}
