
'use client'
import { useState } from 'react';
import { LuCopy } from "react-icons/lu";
import { Button } from "./ui/button";

export default function CopyPrivate({publicKey}: {publicKey: string}){
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000); // Reset after 2 seconds
    };

    return <div>
        <Button onClick={handleCopy} className={copied ? "bg-green-500 hover:bg-green-600" : ""}>
            <div className="flex justify-center text-l gap-2 ">
                {copied ? "Copied!" : "Copy public key"}
                <div className="py-1">
                    <LuCopy/>
                </div>
            </div>
        </Button>
    </div>
}
