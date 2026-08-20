import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="">
        <div className="mb-80">
          <h1 className="text-4xl text-center">Welcome to Motif</h1>
          <h2 className="text-2xl text-center">Your vibe finder</h2>

          <div className="flex w-fill justify-center gap-4 mt-10">
            <Link className="border px-4 py-2 rounded-lg text-sm" href="/demo">
              Watch a demo
            </Link>
            <Link
              className="border px-4 py-2 rounded-lg text-sm"
              href="/signIn"
            >
              Find my vibe
            </Link>
          </div>
        </div>

        <div className="w-screen bg-zinc-800 h-[35vh] absolute bottom-0 left-0 p-5 flex justify-center items-top gap-2 flex-wrap overflow-clip">
          <div className="w-full flex justify-center gap-2 py">
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
          </div>
          <div className="w-full flex justify-center gap-2 py">
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700 ml"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
            <div className="w-full h-auto aspect-square rounded-lg bg-zinc-700"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
