import mongoose, {Schema} from "mongoose";

const walletSchema = new Schema({
    userEmail: String,
    name: String,
    mnemonic: String,
    wallets: [
        {
            public: String,
            private: String,
            address: String,
            network: String
        }
    ]
},
{
    timestamps: true
}
)

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", walletSchema)

export default Wallet