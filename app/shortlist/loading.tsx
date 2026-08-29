export default function Loading() {
  return (
    <main className="min-h-screen bg-motif-black px-5 py-5 text-motif-ivory sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[96rem] animate-pulse border-2 border-motif-ivory/30 p-5 sm:p-10">
        <div className="h-4 w-40 bg-motif-red/70" />
        <div className="mt-10 h-24 max-w-3xl bg-motif-ivory/20 sm:h-36" />
        <div className="mt-5 h-5 max-w-xl bg-motif-ivory/10" />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {["one", "two", "three", "four", "five", "six"].map((item) => (
            <div key={item} className="h-[28rem] border-2 border-motif-ivory/20 bg-motif-ivory/10" />
          ))}
        </div>
      </div>
    </main>
  );
}
