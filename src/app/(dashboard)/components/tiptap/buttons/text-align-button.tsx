import { type Editor, useEditorState } from "@tiptap/react";
import { ChevronDown, TextAlignCenter, TextAlignEnd, TextAlignJustify, TextAlignStart } from "lucide-react";
import type { JSX } from "react";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "@/utils/cn";

type TextAlign = "left" | "right" | "center" | "justify";

export default function TextAlignButton({ editor }: { editor: Editor }) {
  const { isTextAlignActiveFn, toggleTextAlign } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isTextAlignActiveFn: (textAlign: TextAlign) => ctx.editor.isActive({ textAlign }),
        toggleTextAlign: (textAlign: TextAlign) => ctx.editor.chain().toggleTextAlign(textAlign).run(),
      };
    },
  });

  const menuItems: { textAlign: TextAlign; icon: JSX.Element }[] = [
    {
      icon: <TextAlignStart className="text-inherit" />,
      textAlign: "left",
    },
    {
      icon: <TextAlignEnd className="text-inherit" />,
      textAlign: "right",
    },
    {
      icon: <TextAlignCenter className="text-inherit" />,
      textAlign: "center",
    },
    {
      icon: <TextAlignJustify className="text-inherit" />,
      textAlign: "justify",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="gap-1"
          size="sm"
          variant={
            isTextAlignActiveFn("left") || isTextAlignActiveFn("right") || isTextAlignActiveFn("center") || isTextAlignActiveFn("justify")
              ? "default"
              : "ghost"
          }
        >
          {isTextAlignActiveFn("left") ? (
            <TextAlignStart className="text-inherit" />
          ) : isTextAlignActiveFn("right") ? (
            <TextAlignEnd className="text-inherit" />
          ) : isTextAlignActiveFn("center") ? (
            <TextAlignCenter className="text-inherit" />
          ) : isTextAlignActiveFn("justify") ? (
            <TextAlignJustify className="text-inherit" />
          ) : (
            <TextAlignStart className="text-inherit" />
          )}
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menuItems.map((item, key) => (
          <DropdownMenuItem
            key={key}
            className={cn(isTextAlignActiveFn(item.textAlign) ? "bg-accent text-accent-foreground" : undefined)}
            onClick={() => toggleTextAlign(item.textAlign)}
            onSelect={() =>
              setTimeout(() => {
                editor.chain().focus().run();
              }, 500)
            }
          >
            {item.icon}
            {item.textAlign}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
