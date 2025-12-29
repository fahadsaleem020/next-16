import { type Editor, useEditorState } from "@tiptap/react";
import { ChevronDown, Highlighter } from "lucide-react";
import { useMemo } from "react";
import { Box } from "@/ui/box";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { Flex } from "@/ui/flex";
import { Stack } from "@/ui/stack";
import { cn } from "@/utils/cn";

export default function HighlighButton({ editor }: { editor: Editor }) {
  const { isHighlight } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isHighlight: ctx.editor.isActive("highlight"),
      };
    },
  });

  const colorList = [
    ["#52525b", "#3f3f46", "#27272a", "#18181b"],
    ["#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"],
    ["#ca8a04", "#a16207", "#854d0e", "#713f12"],
    ["#16a34a", "#15803d", "#166534", "#14532d"],
    ["#0284c7", "#0369a1", "#075985", "#0c4a6e"],
    ["#4f46e5", "#4338ca", "#3730a3", "#312e81"],
    ["#c026d3", "#a21caf", "#86198f", "#701a75"],
  ];

  const currentSelectedColor = useMemo(() => editor.getAttributes("highlight")?.color as string | undefined, [editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1" size="sm" variant={isHighlight ? "default" : "ghost"}>
          <Highlighter />
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-fit p-0">
        {colorList.map((colors, key1) => (
          <Stack className="gap-0" key={key1}>
            <DropdownMenuItem
              className="p-0 gap-0!"
              onSelect={() =>
                setTimeout(() => {
                  editor.chain().focus().run();
                }, 500)
              }
            >
              {colors.map((color, key2) => (
                <Flex key={key2} className="gap-0">
                  <Box
                    className={cn("size-5 border border-transparent hover:border-white", currentSelectedColor === color && "border-white")}
                    onClick={() => editor.chain().focus().setHighlight({ color }).run()}
                    style={{
                      backgroundColor: color,
                    }}
                  />
                </Flex>
              ))}
            </DropdownMenuItem>
          </Stack>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
