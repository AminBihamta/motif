import Form from "next/form";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="w-screen h-screen">
      <main className="flex w-full h-full justify-center items-center flex-col">
        <h1 className="text-center text-4xl">Sign in to find your vibe</h1>
        <Form
          action="/signin"
          className="flex flex-col gap-2 w-full max-w-80 items-end mt-8"
        >
          <input
            className="border rounded-lg px-4 py-2 w-full"
            name="email"
            type="email"
            placeholder="yourname@example.com"
          />
          <input
            className="border rounded-lg px-4 py-2 w-full"
            name="password"
            type="password"
            placeholder="12345678"
          ></input>
          <Link href="/find-my-vibe" className="border rounded-lg px-4 py-2 w-fit" type="submit">
            Sign in
          </Link>
        </Form>
      </main>
    </div>
  );
}
