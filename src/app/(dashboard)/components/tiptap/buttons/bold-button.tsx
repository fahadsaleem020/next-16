import { type Editor, useEditorState } from "@tiptap/react";
import { Bold } from "lucide-react";
import { Button } from "@/ui/button";

export default function BoldButton({ editor }: { editor: Editor }) {
  const { canBold, isBold } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold"),
        canBold: ctx.editor.can().chain().toggleBold().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canBold}
      size="icon-sm"
      variant={isBold ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold />
    </Button>
  );
}
