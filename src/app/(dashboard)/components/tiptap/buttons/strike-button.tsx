import { type Editor, useEditorState } from "@tiptap/react";
import { Strikethrough } from "lucide-react";
import { Button } from "@/ui/button";

export default function StrikeButton({ editor }: { editor: Editor }) {
  const { canStrike, isStrike } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isStrike: ctx.editor.isActive("strike"),
        canStrike: ctx.editor.can().chain().toggleStrike().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canStrike}
      size="icon-sm"
      variant={isStrike ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleStrike().run()}
    >
      <Strikethrough />
    </Button>
  );
}
