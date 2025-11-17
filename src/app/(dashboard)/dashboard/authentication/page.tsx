import { getAutheCredentials } from "@/actions/getauthcredentials";
import { Stack } from "@/ui/stack";

import AuthenticationList from "../../components/authenticationlist";

export default async function AuthenticationPage() {
  const authList = getAutheCredentials();

  return (
    <Stack className="scroll">
      <AuthenticationList awaitedData={authList} />
    </Stack>
  );
}
