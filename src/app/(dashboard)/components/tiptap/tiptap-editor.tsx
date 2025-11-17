"use client";

import { Highlight } from "@tiptap/extension-highlight";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { Selection } from "@tiptap/extensions";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo } from "react";
import content from "@/lib/contentent.json";
import TiptapToolbar from "./tiptap-toolbar";
import "@/editor-styles/blog.scss";

export default function TiptapEditor() {
  const editor = useEditor({
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
      },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      HorizontalRule,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
    ],
    content,
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);
  if (!editor) return null;

  return (
    <EditorContext.Provider value={providerValue}>
      <TiptapToolbar />
      <EditorContent
        spellCheck="false"
        autoCorrect="false"
        role="Blog Editor"
        // try removing flex properties
        className="max-w-[648px] size-full my-0 mx-auto [&_.ProseMirror:focus]:outline-none [&_.ProseMirror:focus]:shadow-none flex flex-col flex-1 pt-12 px-12 pb-[30vh] max-[480px]:[&_.ProseMirror]:p-[1rem_1.5rem_30vh] selection:bg-primary selection:text-primary-foreground"
        editor={editor}
      />
    </EditorContext.Provider>
  );
}
