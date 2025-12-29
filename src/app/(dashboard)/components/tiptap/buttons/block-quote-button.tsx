import { type Editor, useEditorState } from "@tiptap/react";
import { TextQuote } from "lucide-react";
import { Button } from "@/ui/button";

export default function BlockQuoteButton({ editor }: { editor: Editor }) {
  const { isBlockQuoteActive, canToggle } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBlockQuoteActive: ctx.editor.isActive("blockquote"),
        canToggle: ctx.editor.can().chain().focus().toggleBlockquote().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canToggle}
      size="icon-sm"
      variant={isBlockQuoteActive ? "default" : "ghost"}
      onClick={() => editor.chain().focus().toggleBlockquote().run()}
    >
      <TextQuote />
    </Button>
  );
}
