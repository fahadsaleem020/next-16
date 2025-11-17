import { Stack } from "@/ui/stack";
import { SignInForm } from "../(client)/components/signin-form";

export default function Sign() {
  return (
    <Stack className="h-svh">
      <Stack className="gap-4 p-5 scroll w-full md:w-md m-auto">
        <Stack className="text-center sm:text-left">
          <h1 className="text-lg leading-none font-semibold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">Enter your email below to login to your account</p>
        </Stack>
        <SignInForm withModal={false} />
      </Stack>
    </Stack>
  );
}
