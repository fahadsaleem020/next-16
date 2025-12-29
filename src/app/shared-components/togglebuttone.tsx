"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { FC } from "react";
import { Button, type ButtonProps } from "@/ui/button";

export const ToggleTheme: FC<ButtonProps> = ({ ...props }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="outline" size="icon-sm" onClick={() => setTheme(theme === "light" ? "dark" : "light")} {...props}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
};
