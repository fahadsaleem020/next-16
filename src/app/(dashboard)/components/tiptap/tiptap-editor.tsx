"use client";

import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { Selection } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import content from "@/lib/contentent.json";
import TiptapToolbar from "./tiptap-toolbar";
import "@/editor-styles/blog.scss";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { useTheme } from "next-themes";
import { Box } from "@/ui/box";
import { cn } from "@/utils/cn";
import { Video } from "./extensions/video-extension";

const lowlight = createLowlight(all);

export default function TiptapEditor() {
  const { theme } = useTheme();
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
        codeBlock: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
          defaultProtocol: "https",
        },
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Video,
      CodeBlockLowlight.configure({
        enableTabIndentation: true,
        lowlight,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
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

  if (!editor) return null;

  return (
    <Box>
      <TiptapToolbar editor={editor} />
      <EditorContent
        spellCheck="false"
        autoCorrect="false"
        role="Blog Editor"
        // try removing flex properties
        className={cn(
          "max-w-[648px] size-full my-0 mx-auto [&_.ProseMirror:focus]:outline-none [&_.ProseMirror:focus]:shadow-none flex flex-col flex-1 pt-5 px-12 pb-[30vh] max-[480px]:[&_.ProseMirror]:p-[1rem_1.5rem_30vh] selection:bg-primary selection:text-primary-foreground",
          theme === "dark" ? "theme-dark" : "theme-light",
        )}
        editor={editor}
      />
    </Box>
  );
}
