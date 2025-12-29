import { type Editor, useEditorState } from "@tiptap/react";
import { Subscript } from "lucide-react";
import { Button } from "@/ui/button";

export default function SuperscriptButton({ editor }: { editor: Editor }) {
  const { canSuperscript, isSuperscript } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isSuperscript: ctx.editor.isActive("superscript"),
        canSuperscript: ctx.editor.can().chain().toggleSuperscript().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canSuperscript}
      size="icon-sm"
      variant={isSuperscript ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleSuperscript().run()}
    >
      <Subscript />
    </Button>
  );
}
