import { type Editor, useEditorState } from "@tiptap/react";
import { ChevronDown, List, ListOrdered } from "lucide-react";
import type { JSX } from "react";
import { Button } from "@/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/ui/dropdown-menu";
import { cn } from "@/utils/cn";

type ListType = "orderedList" | "bulletList";
export default function ListButton({ editor }: { editor: Editor }) {
  const { toggleListFn, isListActiveFn } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isListActiveFn: (listType: ListType) => ctx.editor.isActive(listType),
        toggleListFn: (listType: ListType) => {
          const chain = ctx.editor.chain().focus();
          if (listType === "bulletList") return chain.toggleBulletList().run();
          if (listType === "orderedList") return chain.toggleOrderedList().run();
          return false;
        },
      };
    },
  });

  const lists: { icon: JSX.Element; text: string; listType: ListType }[] = [
    {
      icon: <List className="text-inherit" />,
      text: "Bullet List",
      listType: "bulletList",
    },
    {
      icon: <ListOrdered className="text-inherit" />,
      text: "Ordered List",
      listType: "orderedList",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1" size="sm" variant={isListActiveFn("bulletList") || isListActiveFn("orderedList") ? "default" : "ghost"}>
          {isListActiveFn("bulletList") ? <List /> : isListActiveFn("orderedList") ? <ListOrdered /> : <List />}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {lists.map((list, key) => (
          <DropdownMenuItem
            key={key}
            className={cn(isListActiveFn(list.listType) ? "bg-accent text-accent-foreground" : undefined)}
            onClick={() => toggleListFn(list.listType)}
            onSelect={() =>
              setTimeout(() => {
                editor.chain().focus().run();
              }, 500)
            }
          >
            {list.icon}
            {list.text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
