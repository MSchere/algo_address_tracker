"use client";

import { submitAddressAction } from "$lib/form.actions";
import { WalletAddressSchema } from "$lib/zod.schemas";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AddressForm() {
    const [state, formAction] = useFormState(submitAddressAction, undefined);
    const [address, setAddress] = useState("");
    const [isAddressValid, setIsAddressValid] = useState(false);

    useEffect(() => {
        setIsAddressValid(WalletAddressSchema.safeParse(address).success);
    }, [address]);

    useEffect(() => {
        if (!state) return;
        setAddress("");
        if (!state.success && state.errorMessage) {
            toast({
                variant: "destructive",
                title: state.errorMessage,
            });
            console.error(state.errorMessage);
            return;
        }
        toast({
            variant: "creative",
            title: "Wallet address submitted!",
        });
    }, [state]);

    function SubmitButton() {
        const { pending } = useFormStatus();
        return (
            <Button
                type="submit"
                disabled={!isAddressValid || pending}
                className="w-28 bg-coral font-bold text-background hover:bg-coral hover:brightness-90"
            >
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
            </Button>
        );
    }

    return (
        <form className="flex w-full gap-4" action={formAction}>
            <Input
                name="address"
                className="bg-muted text-center text-xl"
                type="text"
                maxLength={58}
                placeholder="Algorand wallet address (ex: 3JX5...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <SubmitButton />
        </form>
    );
}
