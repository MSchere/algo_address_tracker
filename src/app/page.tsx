import { Suspense } from "react";
import AddressForm from "./components/AddressForm";
import Wallets from "./components/Wallets/Wallets";
import Loading from "./components/utils/Loading";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-white">
            <div className="flex flex-col gap-20 rounded border bg-muted px-4 py-8 lg:px-16 lg:py-8">
                <div className="flex flex-col gap-8">
                    <h1 className="text-center text-5xl  font-extrabold tracking-tight text-white md:text-[5rem]">
                        <span className="text-teal">Algo</span> Balance Tracker
                    </h1>
                    <p className="text-center text-2xl font-semibold md:text-xl">
                        Track your <span className="text-coral">Algorand</span> testnet wallet balance in real time!
                    </p>
                </div>
                <div className="flex w-full flex-col gap-8">
                    <AddressForm />
                    <Suspense
                        fallback={
                            <div className="w-screen rounded-md border lg:h-[720px] lg:w-[1000px]">
                                <Loading />
                            </div>
                        }
                    >
                        <Wallets />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
