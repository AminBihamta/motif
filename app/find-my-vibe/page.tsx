import Form from "next/form";
import Link from "next/link"

export default function FindMyVibe() {
  return (
    <div className="flex w-screen h-screen">
      <main className="w-full h-full flex justify-center items-center ">
        <Form>
          <div className="flex w-full max-w-screen justify-center gap-4 flex-wrap">
            <input
              type="file"
              name="file1"
              className="border p-4 bg-zinc-800 flex w-fill h-auto aspect-square"
            ></input><input
              type="file"
              name="file2"
              className="border p-4 bg-zinc-800 flex w-fill h-auto aspect-square"
            ></input><input
              type="file"
              name="file3"
              className="border p-4 bg-zinc-800 flex w-fill h-auto aspect-square"
            ></input><input
              type="file"
              name="file4"
              className="border p-4 bg-zinc-800 flex w-fill h-auto aspect-square"
            ></input><input
              type="file"
              name="file5"
              className="border p-4 bg-zinc-800 flex w-fill h-auto aspect-square"
            ></input>
          </div>
          <Link href="my-vibe" className="border rounded-lg px-4 py-2 w-full" type="submit">
            Find my vibe
          </Link>
        </Form>
      </main>
    </div>
  );
}
