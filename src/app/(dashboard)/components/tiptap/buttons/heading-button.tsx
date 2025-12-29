import { type Editor, useEditorState } from "@tiptap/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "@/utils/cn";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export default function HeadingButton({ editor }: { editor: Editor }) {
  const { isHeading, isHeadingLevelFn, isHeadingActive, getHeadingLevel, setHeadingFn } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isHeading: ctx.editor.isActive("heading"),
        isHeadingLevelFn: (level: number) => ctx.editor.isActive("heading", { level }),
        isHeadingActive: ctx.editor.isActive("heading"),
        getHeadingLevel: ctx.editor.getAttributes("heading").level as Level,
        setHeadingFn: (level: Level) => ctx.editor.chain().focus().setHeading({ level }).run(),
      };
    },
  });

  const items = Array.from({ length: 6 }, (_, key) => {
    const level = (key + 1) as Level;
    return (
      <DropdownMenuItem
        onSelect={() =>
          setTimeout(() => {
            editor.chain().focus().run();
          }, 500)
        }
        onClick={() => setHeadingFn(level)}
        key={key}
        className={cn(isHeadingLevelFn(level) ? "bg-accent text-accent-foreground" : undefined)}
      >
        <span className="text-xs">H{level}</span>heading {level}
      </DropdownMenuItem>
    );
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1" size="sm" variant={isHeading ? "default" : "ghost"}>
          {isHeadingActive ? <span className="text-xs">H{getHeadingLevel}</span> : "H"}
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{items.map((Item) => Item)}</DropdownMenuContent>
    </DropdownMenu>
  );
}
