import type { Editor } from "@tiptap/react";
import { Settings } from "lucide-react";
import type { DropzoneOptions } from "react-dropzone";
import HighlighButton from "@/editor-styles/highlight-button";
import { DropzoneProvider } from "@/providers/dropzone.provider";
import { Button } from "@/ui/button";
import { Flex } from "@/ui/flex";
import { Separator } from "@/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";
import { Stack } from "@/ui/stack";
import BlockQuoteButton from "./buttons/block-quote-button";
import BoldButton from "./buttons/bold-button";
import CodeBlockButton from "./buttons/code-block-button";
import HeadingButton from "./buttons/heading-button";
import ItalicButton from "./buttons/italic-button";
import LinkButton from "./buttons/link-button";
import ListButton from "./buttons/list-button";
import PexelsButton from "./buttons/pexels-button";
import StrikeButton from "./buttons/strike-button";
import SubscriptButton from "./buttons/subscript-button";
import SuperscriptButton from "./buttons/superscript-button";
import TextAlignButton from "./buttons/text-align-button";
import UnderlineButton from "./buttons/underline-button";
import UndoRedoButton from "./buttons/undo-redo-button";
import YoutubeButton from "./buttons/youtube-button";
import MetaForm from "./metaform";
import ThumbnailForm from "./thumbnailform";

export default function TiptapToolbar({ editor }: { editor: Editor }) {
  const dropzoneOptions: DropzoneOptions = {
    maxFiles: 3,
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
    noClick: true,
    noKeyboard: true,
  };
  return (
    <Flex className="py-1 px-2.5 sticky top-0 bg-background z-10 scroll">
      <Flex className="mx-auto">
        <UndoRedoButton editor={editor} />
        <Separator orientation="vertical" className="h-6! dark:bg-gray-700 bg-gray-300" />
        <HeadingButton editor={editor} />
        <ListButton editor={editor} />
        <BlockQuoteButton editor={editor} />
        <CodeBlockButton editor={editor} />
        <Separator orientation="vertical" className="h-6! dark:bg-gray-700 bg-gray-300" />
        <BoldButton editor={editor} />
        <ItalicButton editor={editor} />
        <StrikeButton editor={editor} />
        <UnderlineButton editor={editor} />
        <Separator orientation="vertical" className="h-6! dark:bg-gray-700 bg-gray-300" />
        <HighlighButton editor={editor} />
        <LinkButton editor={editor} />
        <Separator orientation="vertical" className="h-6! dark:bg-gray-700 bg-gray-300" />
        <SubscriptButton editor={editor} />
        <SuperscriptButton editor={editor} />
        <Separator orientation="vertical" className="h-6! dark:bg-gray-700 bg-gray-300" />
        <TextAlignButton editor={editor} />
        <PexelsButton editor={editor} />
        <YoutubeButton editor={editor} />
      </Flex>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size={"icon-sm"} className="sticky right-0 bg-white dark:bg-black">
            <Settings />
          </Button>
        </SheetTrigger>
        <SheetContent withCloseIcon={false} onOpenAutoFocus={(e) => e.preventDefault()}>
          <Stack className="bg-background h-full shadow-lg rounded-xl border scroll">
            <SheetHeader className="sr-only">
              <SheetTitle>Edit blog settings</SheetTitle>
            </SheetHeader>

            {/* thumbnail */}
            <DropzoneProvider dropzoneOptions={dropzoneOptions}>
              <ThumbnailForm />
            </DropzoneProvider>

            {/* Meta  */}
            <MetaForm />
          </Stack>
        </SheetContent>
      </Sheet>
    </Flex>
  );
}
