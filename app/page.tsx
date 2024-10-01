import { MdOutlineArrowOutward } from "react-icons/md";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-orange-100 to-yellow-200 text-center">
      <div className="py-16 px-10 font-bold text-2xl">
        <h2 className="mb-4 text-4xl">Welcome to Batua (hindi for wallet)</h2>
        <p className="text-lg font-normal">
          Batua is a managed crypto wallet. Join with us, the future of money!
        </p>
      </div>

      {/* Arrow pointing towards the sign-in button */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-9xl transform rotate-45 animate-bounce">
          <MdOutlineArrowOutward />
        </div>
        <span className="text-2xl mt-4">Sign in now!</span>
      </div>

      {/* Additional filler content */}
      <div className="absolute bottom-16 left-0 right-0">
        <h3 className="text-3xl font-semibold mb-6">Why choose Batua?</h3>
        <div className="flex justify-center space-x-8">
          <div className="p-6 max-w-sm bg-white shadow-md rounded-lg">
            <h4 className="text-xl font-semibold mb-4">Secure & Private</h4>
            <p className="text-sm">Your crypto is protected with industry-leading encryption and security standards.</p>
          </div>
          <div className="p-6 max-w-sm bg-white shadow-md rounded-lg">
            <h4 className="text-xl font-semibold mb-4">Easy to Use</h4>
            <p className="text-sm">A user-friendly interface that makes handling crypto as easy as traditional wallets.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
