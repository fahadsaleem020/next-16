"use client";

import { type Editor, useCurrentEditor } from "@tiptap/react";
import { Button } from "@/ui/button";

export default function TiptapToolbar() {
  const { editor } = useCurrentEditor() as Record<"editor", Editor>;

  return (
    <Button
      disabled={!editor?.can().chain().toggleBold().run()}
      onClick={() => editor?.chain().focus().toggleBold().run()}
      variant={editor?.isActive("bold") ? "default" : "outline"}
      className="sticky top-0"
    >
      bold
    </Button>
  );
}
