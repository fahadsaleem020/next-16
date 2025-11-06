import { getAutheCredentials } from "@/actions/getauthcredentials";
import { Stack } from "@/ui/stack";
import AuthenticationList from "../../components/authenticationlist";

export default async function AuthenticationPage() {
  const authList = await getAutheCredentials();

  return (
    <Stack className="overflow-auto scroll">
      <AuthenticationList awaitedData={authList} />
    </Stack>
  );
}
