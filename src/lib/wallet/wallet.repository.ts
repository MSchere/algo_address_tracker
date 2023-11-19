import { type Wallet } from "@prisma/client";
import { prisma } from "../prisma";

export class WalletsRepository {
    static async getWallet(address: string): Promise<Wallet | null> {
        const wallet = await prisma.wallet.findUnique({
            where: { address },
        });
        return wallet;
    }

    static async getAllWallets(): Promise<Wallet[]> {
        const wallets = await prisma.wallet.findMany();
        return wallets;
    }

    static async createWallet(address: string, balance: bigint): Promise<Wallet | null> {
        try {
            const wallet = await prisma.wallet.create({
                data: { address, balance },
            });
            return wallet;
        } catch (error) {
            return null;
        }
    }

    static async updateBalance(address: string, balance: bigint): Promise<Wallet | null> {
        try {
            const wallet = await prisma.wallet.update({
                where: { address },
                data: { balance },
            });
            return wallet;
        } catch (error) {
            return null;
        }
    }

    static async updateNfd(address: string, nfd: string): Promise<Wallet | null> {
        try {
            const wallet = await prisma.wallet.update({
                where: { address },
                data: { nfd },
            });
            return wallet;
        } catch (error) {
            return null;
        }
    }

    static async deleteWallet(address: string): Promise<Wallet | null> {
        try {
            const wallet = await prisma.wallet.delete({
                where: { address },
            });
            return wallet;
        } catch (error) {
            return null;
        }
    }
}
