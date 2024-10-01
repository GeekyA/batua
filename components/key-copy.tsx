'use client';

import React, { useState } from 'react';

const CopyKey = ({ key }: { key: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(key)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
            })
            .catch(err => console.error('Failed to copy: ', err));
    };

    return (
        <div>
            <button onClick={copyToClipboard}>
                {copied ? 'Copied!' : 'Copy Key'}
            </button>
        </div>
    );
};

export default CopyKey;
