"use client";

import { useToast } from "$hooks/use-toast";
import { Copy } from "lucide-react";

interface Props {
    value?: string;
    className?: string;
    iconSize?: number;
}

export default function CopyButton({ value, className, iconSize }: Props) {
    const { toast } = useToast();
    async function onClick(e: React.MouseEvent, value: string) {
        e.preventDefault();
        await navigator.clipboard.writeText(value);
        toast({
            variant: "creative",
            title: "Copied to clipboard",
        });
    }
    return (
        <button
            className={`${className ?? ""}`}
            onClick={(e) => {
                void onClick(e, value ?? "");
            }}
        >
            <Copy width={iconSize ?? 16} height={iconSize ?? 16} />
        </button>
    );
}
