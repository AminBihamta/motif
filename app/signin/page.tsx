import Form from "next/form";
import AnimatedContainer from "../components/animated-container";
import { GoogleCircle, ArrowRight } from "iconoir-react/regular";
import CustomLink from "../components/CustomLink";
import CustomButton from "../components/CustomButton";

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
          <span>Sign in to continue discovering</span>
          <CustomLink
            label="Sign in with Google"
            link=""
            icon={GoogleCircle}
            theme="charcol"
            icon_left={true}
          />
          <div className="flex flex-row justify-center items-center border-motif-charcoal gap-2 w-20 py-6">
            <div className="flex min-w-full bg-motif-charcoal h-px -mb-1"></div>
            <span className="text-motif-charcoal flex w-fit">or</span>
            <div className="flex min-w-full bg-motif-charcoal h-px -mb-1"></div>
          </div>
          <Form
            action="/signin"
            className="flex flex-col gap-2 w-full max-w-80 items-end  text-motif-charcoal"
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
            <p className="text-center w-full">New to Motif? <span className="text-motif-red hover:underline cursor-pointer">Create an account!</span></p>

          </Form>
        </div>
      </main>
    </AnimatedContainer>
  );
}
