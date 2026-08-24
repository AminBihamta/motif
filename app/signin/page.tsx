import Form from "next/form";
import AnimatedContainer from "../components/animated-container";
import CustomButton from "../components/CustomButton";
import Link from "next/link"

export default function SignIn() {
  return (
    <AnimatedContainer bgSource="/assets/sign-in-bg.png">
      <main className="flex w-[50%] h-full justify-center items-center flex-col">
        <div className="flex flex-col justify-center items-center bg-motif-ivory rounded-2xl  p-10">
          <span className=" font-bold text-4xl text-center elsie] text-motif-charcoal">
            Motif
          </span>
          <h1 className="text-center text-6xl text-motif-charcoal">
            Welcome back
          </h1>
          <span className="text-motif-charcoal mb-10 mt-2">Sign in to continue discovering</span>

          <Link
            className={`border px-4 py-2 cursor-pointer rounded-lg text-sm hover:text-motif-charcoal  flex flex-row gap-1 justify-center items-center transition-colors duration-300 ease-in-out hover:border-motif-ivory hover:animate-[gap-pulse_1s_ease-in-out_infinite] text-motif-charcoal hover:text-motif-ivory border-motif-charcoal hover:bg-motif-charcoal hover:border-motif-charcoal bg-motif-charcol border-motif-charcol hover:text-motif-charcol w-full gap-2`}
            href=""
          >

                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block w-4">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                Sign in with Google

          </Link>
          <div className="flex flex-row justify-center items-center border-motif-charcoal gap-2 w-43 py-6">
            <div className="flex min-w-full bg-motif-charcoal h-px -mb-1"></div>
            <span className="text-motif-charcoal flex w-fit">or</span>
            <div className="flex min-w-full bg-motif-charcoal h-px -mb-1"></div>
          </div>
          <Form
            action="/signin"
            className="flex flex-col gap-2 max-w-80 items-end  text-motif-charcoal w-full max-w-full"
          >
            <label className="flex w-full flex-col">
              <span>Email</span>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                name="email"
                type="email"
                placeholder="yourname@example.com"
              />
            </label>
            <label className="flex w-full flex-col">
              <div className="flex w-full justify-between">
                <span>Password</span>
                <span className="text-motif-red text-sm hover:underline cursor-pointer">Forgot password?</span>
              </div>
              <input
                className="border rounded-lg px-4 py-2 w-full"
                name="password"
                type="password"
                placeholder="12345678"
              ></input>
            </label>
            <CustomButton
              label="Sign in"
              theme="charcol"
              icon_left={false}
              custom_className="w-full"
              />
            <p className="text-center w-full mt-4">New to Motif? <span className="text-motif-red hover:underline cursor-pointer">Create an account!</span></p>

          </Form>
        </div>
      </main>
    </AnimatedContainer>
  );
}
