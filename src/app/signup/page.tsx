import { Stack } from "@/ui/stack";
import { SignUpForm } from "../(client)/components/signup-form";

export default function Sign() {
  return (
    <Stack className="h-svh">
      <Stack className="gap-4 p-5 scroll w-full md:w-md m-auto">
        <Stack className="text-center sm:text-left">
          <h1 className="text-lg leading-none font-semibold">Create an account</h1>
          <p className="text-muted-foreground text-sm">Enter your information below to create your account</p>
        </Stack>
        <SignUpForm withModal={false} />
      </Stack>
    </Stack>
  );
}
