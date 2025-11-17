import { UserProvider } from "@/providers/user.provider";

export default function ClientLayout({ children, authButton }: LayoutProps<"/">) {
  return (
    <UserProvider>
      <nav className="p-4 bg-gray-800 text-white">{authButton}</nav>
      {children}
    </UserProvider>
  );
}
