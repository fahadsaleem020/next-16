import { type Editor, useEditorState } from "@tiptap/react";
import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/ui/button";
import { Flex } from "@/ui/flex";

export default function UndoRedoButton({ editor }: { editor: Editor }) {
  const { canUndo, canRedo } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        canUndo: ctx.editor.can().chain().focus().undo().run(),
        canRedo: ctx.editor.can().chain().focus().redo().run(),
      };
    },
  });

  return (
    <Flex className="gap-0">
      <Button
        disabled={!canUndo}
        variant={canUndo ? "default" : "ghost"}
        type="button"
        size={"icon-sm"}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 />
      </Button>
      <Button
        disabled={!canRedo}
        variant={canRedo ? "default" : "ghost"}
        type="button"
        size={"icon-sm"}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 />
      </Button>
    </Flex>
  );
}
