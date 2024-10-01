import { LuCopy } from "react-icons/lu";
import { Button } from "./ui/button";


export default function CopyPrivate({publicKey}: {publicKey: string}){
    return <div>
        <Button>
            <div className="flex justify-center text-l gap-2 ">
                Copy public key
                <div className="py-1">
                    <LuCopy/>
                </div>
                
            </div>
            
    </Button>
    </div>
    
}