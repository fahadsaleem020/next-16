import { type Editor, useEditorState } from "@tiptap/react";
import { Underline } from "lucide-react";
import { Button } from "@/ui/button";

export default function UnderlineButton({ editor }: { editor: Editor }) {
  const { canUnderline, isUnderline } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isUnderline: ctx.editor.isActive("underline"),
        canUnderline: ctx.editor.can().chain().toggleUnderline().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canUnderline}
      size="icon-sm"
      variant={isUnderline ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleUnderline().run()}
    >
      <Underline />
    </Button>
  );
}
