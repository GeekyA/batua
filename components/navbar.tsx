'use client'

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import {signIn , signOut} from "next-auth/react"
import { useSession } from "next-auth/react";
import { stat } from "fs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  // const [text, setText] = useState("बटुआ");
  const {status} = useSession();
  const router = useRouter()

  console.log("status is",status)
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => (prev === "बटुआ" ? "Batua" : "बटुआ"));
    }, 1200); // Change every 2 seconds

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  
  */
  if (status==='authenticated'){
    router.push('/mnemonic')
  }
  const text = "बटुआ | Batua"

  return (
    <nav className="flex items-center px-10 py-10 font-bold">
      <div className="text-4xl mr-4">

        <FaMoneyBillTransfer />
      </div>
      <Link href={"/"}>
        <h1 className="text-4xl">{text}</h1>
      </Link>
      

      {(status==='authenticated')?<div className="ml-auto">
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>:<div className="ml-auto">
        <Button onClick={() => signIn("google")}>Sign in</Button>
      </div>}
    </nav>
  );
}
