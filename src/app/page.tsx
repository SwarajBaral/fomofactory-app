import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#02276d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Real time crypto tracker
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/stocks"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Stocks</h3>
            <div className="text-lg">Track stock tickers in real time</div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/crypto"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Crypto</h3>
            <div className="text-lg">Track crypto prices in real time</div>
          </Link>
        </div>
      </div>
    </main>
  );
}
