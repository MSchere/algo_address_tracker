import { type WalletSnapshot } from "@prisma/client";
import { prisma } from "../prisma";

export class WalletSnapshotsRepository {

    static async createWalletSnapshot(walletAddress: string, balance: number): Promise<WalletSnapshot | null> {
        const id = `${walletAddress.substring(0, 8
            )}-${Date.now()}`;
        const walletSnapshot = await prisma.walletSnapshot.create({
            data: { id, walletAddress, balance },
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

}
