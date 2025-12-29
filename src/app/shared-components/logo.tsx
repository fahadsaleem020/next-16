import { FaShield } from "react-icons/fa6";
import { Flex } from "@/ui/flex";

export const Logo = () => {
  return (
    <Flex className="bg-sidebar-accent-foreground text-sidebar-accent flex aspect-square size-8 justify-center rounded-lg">
      <FaShield className="size-3.5" />
    </Flex>
  );
};
