import { type Editor, useEditorState } from "@tiptap/react";
import { Italic } from "lucide-react";
import { Button } from "@/ui/button";

export default function ItalicButton({ editor }: { editor: Editor }) {
  const { canItalic, isItalic } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isItalic: ctx.editor.isActive("italic"),
        canItalic: ctx.editor.can().chain().toggleItalic().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canItalic}
      size="icon-sm"
      variant={isItalic ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic />
    </Button>
  );
}
