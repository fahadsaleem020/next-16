import { type Editor, useEditorState } from "@tiptap/react";
import { ExternalLink, Link2, Unlink2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

export default function LinkButton({ editor }: { editor: Editor }) {
  const [value, setValue] = useState("");
  const [open, onOpenChange] = useState(false);
  const { isLinkActive, getLinkValue } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isLinkActive: ctx.editor.isActive("link"),
        getLinkValue: ctx.editor.getAttributes("link").href as string,
      };
    },
  });

  useEffect(() => {
    if (isLinkActive) {
      setValue(getLinkValue);
      onOpenChange(true);
    }
  }, [isLinkActive, getLinkValue]);

  useEffect(() => {
    if (!open && !isLinkActive) {
      setValue("");
    }
  }, [open, isLinkActive]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button className="gap-1" size="sm" variant={isLinkActive ? "default" : "ghost"}>
          <Link2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 min-w-fit">
        <InputGroup className="border-none has-[[data-slot=input-group-control]:focus-visible]:border-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 shadow-none bg-transparent!">
          <InputGroupInput
            placeholder="https://www.example.com"
            autoCapitalize="off"
            className="border-none"
            autoComplete="off"
            autoCorrect="off"
            type="url"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <InputGroupAddon align="inline-end" className="gap-1">
            <InputGroupButton
              aria-label="Insert Link"
              title="Insert"
              size="icon-xs"
              onClick={() => editor.chain().focus().extendMarkRange("link").setLink({ href: value }).run()}
            >
              <Link2 />
            </InputGroupButton>
            <InputGroupButton
              aria-label="Remove Link"
              title="remove"
              size="icon-xs"
              disabled={!isLinkActive}
              onClick={() => {
                editor.chain().focus().unsetLink().run();
              }}
            >
              <Unlink2 />
            </InputGroupButton>
            <InputGroupButton
              aria-label="Visit Link"
              title="Visit"
              size="icon-xs"
              disabled={!isLinkActive}
              onClick={() => window.open(value, "_blank")}
            >
              <ExternalLink />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </PopoverContent>
    </Popover>
  );
}
