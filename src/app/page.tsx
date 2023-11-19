import { Suspense } from "react";
import AddressForm from "./components/AddressForm";
import Wallets from "./components/Wallets/Wallets";
import Loading from "./components/utils/Loading";

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center text-white">
            <div className="container flex flex-col items-center justify-center gap-20 px-4 py-16 md:px-56 md:py-16">
                <div className="flex flex-col gap-8">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                        <span className="text-teal">Algo</span> Balance Tracker
                    </h1>
                <p className="text-center text-2xl font-semibold">Track your <span className="text-coral">Algorand</span> wallet balance in real time!</p>
                </div>
                <div className="flex w-full flex-col gap-8">
                    <AddressForm />
                    <Suspense
                        fallback={
                            <div className="h-[720px] w-full">
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
