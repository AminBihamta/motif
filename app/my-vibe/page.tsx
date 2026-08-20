export default function MyVibe() {
  return (
    <div className="flex w-screen h-screen">
      <main className="w-full h-full flex justify-between items-center flex-col pt-20">
        <div className="flex flex-col gap-8">
          <div className="gap-2 flex flex-col">
            <h1 className="text-4xl">Mid-century modern</h1>
            <p className="text-sm max-w-[90vw]">
              An influential design movement spanning roughly from 1945 to 1970.
              It emphasizes clean lines, simple functional forms, and a lack of
              ornamental embellishment, bridging the gap between indoor living
              and the natural outdoors.
            </p>
          </div>
          <div className="gap-2 flex flex-col">
            <h2 className="text-2xl">What does that mean?</h2>
            <ul className="list-disc list-inside">
              <li>You're annoying</li>
              <li>Boo hoo</li>
              <li>You're purple</li>
            </ul>
          </div>
          <div className="gap-2 flex flex-col">
            <h2 className="text-2xl">Find more your vibe!</h2>
            <form className="flex flex-row w-full gap-2">
              <input type="text" placeholder="Chair, Clothes, Car" className="border rounded-full px-4 py-2 w-full rounded-r" />
              <button className="border rounded-full rounded-l px-4 py-2 w-fits shrink-0">Enlighten me</button>
            </form>

          </div>
        </div>
        <div className="w-screen bg-zinc-800 h-[35vh]  p-5 flex justify-center items-top gap-2 flex-wrap overflow-clip">
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
