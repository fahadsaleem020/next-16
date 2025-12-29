import { type Editor, useEditorState } from "@tiptap/react";
import { CodeXml } from "lucide-react";
import { Button } from "@/ui/button";

export default function CodeBlockButton({ editor }: { editor: Editor }) {
  const { isCodeBlockActive, canToggle } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isCodeBlockActive: ctx.editor.isActive("codeBlock"),
        canToggle: ctx.editor.can().chain().focus().toggleCodeBlock().run(),
      };
    },
  });

  return (
    <Button
      disabled={!canToggle}
      size="icon-sm"
      variant={isCodeBlockActive ? "default" : "ghost"}
      onClick={() => editor.chain().focus().setCodeBlock().run()}
    >
      <CodeXml />
    </Button>
  );
}
