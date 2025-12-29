import { type Editor, useEditorState } from "@tiptap/react";
import { SquareArrowLeft, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

export default function YoutubeButton({ editor }: { editor: Editor }) {
  const [value, setValue] = useState("");
  const [open, onOpenChange] = useState(false);
  const { isYoutubeActive, getYoutubeSrc } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isYoutubeActive: ctx.editor.isActive("youtube"),
        getYoutubeSrc: ctx.editor.getAttributes("youtube").src as string,
      };
    },
  });

  useEffect(() => {
    if (!open && !isYoutubeActive) {
      setValue("");
    } else if (open && isYoutubeActive) {
      setValue(getYoutubeSrc);
    }
  }, [open, isYoutubeActive, getYoutubeSrc]);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button className="gap-1" size="sm" variant={isYoutubeActive ? "default" : "ghost"}>
          <Youtube />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 min-w-fit">
        <InputGroup className="border-none has-[[data-slot=input-group-control]:focus-visible]:border-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 shadow-none bg-transparent!">
          <InputGroupInput
            placeholder="https://www.youtube.com/watch?v=gzSpykMH5EM"
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
              onClick={() =>
                editor.commands.setYoutubeVideo({
                  src: value,
                })
              }
            >
              <SquareArrowLeft />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </PopoverContent>
    </Popover>
  );
}
