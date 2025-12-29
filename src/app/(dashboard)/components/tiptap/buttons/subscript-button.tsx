import { type Editor, useEditorState } from "@tiptap/react";
import { Subscript } from "lucide-react";
import { Button } from "@/ui/button";

export default function SubscriptButton({ editor }: { editor: Editor }) {
  const { canSubscript, isSubscript } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isSubscript: ctx.editor.isActive("subscript"),
        canSubscript: ctx.editor.can().chain().toggleSubscript().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canSubscript}
      size="icon-sm"
      variant={isSubscript ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleSubscript().run()}
    >
      <Subscript />
    </Button>
  );
}
