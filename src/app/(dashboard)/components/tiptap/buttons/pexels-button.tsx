import { type Editor, useEditorState } from "@tiptap/react";
import { Check, ExternalLink, Loader2, Plus } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SiPexels } from "react-icons/si";
import { useDebounceCallback, useIntersectionObserver } from "usehooks-ts";
import { type Type, usePexels } from "@/hooks/use-pexels";
import { Box } from "@/ui/box";
import { Button, Button as ShadButton } from "@/ui/button";
import { Flex } from "@/ui/flex";
import { Input } from "@/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Stack } from "@/ui/stack";
import { cn } from "@/utils/cn";

export default function PexelsButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<Type>("image");
  const [enabled, setEnabled] = useState(false);
  const [search, setSearch] = useState("animals");
  const [query, setQuery] = useState("animals");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching, isLoading } = usePexels({ query, enabled, type });
  // photos
  const photos = useMemo(() => data?.pages.flatMap((p) => p?.photos), [data]);
  const totalPhotos = useMemo(() => photos?.length, [photos]);

  //videos
  const videos = useMemo(() => data?.pages.flatMap((p) => p?.videos), [data]);
  const totalVideos = useMemo(() => videos?.length, [videos]);

  const { isIntersecting, ref } = useIntersectionObserver();
  const { isImageActive, isVideoActive } = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isImageActive: ctx.editor.isActive("image"),
        isVideoActive: ctx.editor.isActive("video"),
      };
    },
  });

  const debounceSearch = useDebounceCallback((value: string) => {
    setQuery(value.trim() === "" ? "animals" : value);
  }, 600);

  useEffect(() => {
    if (open) setEnabled(true);
  }, [open]);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant={isImageActive || isVideoActive ? "default" : "ghost"}>
        <SiPexels />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-transparent! shadow-none p-2 max-sm:w-full pointer-none:" withCloseIcon={false}>
          <Stack className="bg-background border h-full shadow-lg rounded-xl gap-0">
            <SheetHeader>
              <SheetTitle>
                <a
                  className="flex gap-2 items-center justify-center text-lg group"
                  href="https://www.pexels.com/"
                  target="_blank"
                  rel="noopener"
                >
                  <SiPexels className="rounded-xs" />
                  Photos provided by Pexels
                  <ExternalLink className="size-4 transition-all! group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </SheetTitle>
              <Input
                type="url"
                placeholder="Search Something Cool..."
                className="border"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  debounceSearch(e.target.value);
                }}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
              <Flex className="border rounded-md gap-0 p-1">
                <Button
                  onClick={() => setType("image")}
                  className={cn("flex-1", type === "image" && "bg-primary/10 text-primary")}
                  size="sm"
                  variant={"ghost"}
                >
                  Images
                </Button>
                <Button
                  onClick={() => setType("video")}
                  className={cn("flex-1", type === "video" && "bg-primary/10 text-primary")}
                  size="sm"
                  variant={"ghost"}
                >
                  Videos
                </Button>
              </Flex>
            </SheetHeader>
            <Box className="h-full grid grid-cols-2 gap-2 px-4 pt-2 pb-4 overflow-auto scroll">
              {/* photos */}
              {type === "image" &&
                photos?.map((photo, key) => (
                  <Box
                    key={key}
                    ref={key === (totalPhotos ?? 0) - 1 ? ref : undefined}
                    className={cn(
                      "relative h-48 overflow-hidden rounded-md group",
                      editor?.getAttributes("image").title === photo?.id.toString() &&
                        "outline-2 outline-offset-2 outline-blue-500 sticky top-0 z-10",
                    )}
                  >
                    <NextImage
                      blurDataURL={photo?.src.portrait}
                      src={photo?.src.medium ?? ""}
                      fill
                      alt={photo?.alt ?? photo?.photographer ?? ""}
                      objectFit="cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <Stack className="opacity-0 transition-all! duration-200 group group-hover:opacity-100 absolute p-3 inset-0 bg-linear-to-t from-black/80 via-black via-5% to-transparent backdrop-blur-xs">
                      <ShadButton
                        onClick={() =>
                          editor
                            ?.chain()
                            .focus()
                            .setImage({
                              src: photo?.src.original ?? "",
                              alt: photo?.alt ?? photo?.photographer,
                              title: photo?.id.toString(),
                            })
                            .run()
                        }
                        size="icon-sm"
                        variant={editor?.getAttributes("image").title === photo?.id.toString() ? "default" : "secondary"}
                        className="ml-auto shadow-none rounded-full"
                      >
                        {editor?.getAttributes("image").title === photo?.id.toString() ? <Check /> : <Plus />}
                      </ShadButton>
                      <a className="mt-auto mx-auto text-sm capitalize flex gap-0 items-center flex-wrap" href={photo?.url} target="_black">
                        <span className="text-gray-400 mr-1">photo by</span>
                        <Flex className="gap-1">
                          <span className="text-white hover:underline truncate">{photo?.photographer}</span>
                          <ExternalLink className="size-4 transition-all! group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white delay-200!" />
                        </Flex>
                      </a>
                    </Stack>
                  </Box>
                ))}
              {/* videos */}
              {type === "video" &&
                videos?.map((video, key) => {
                  const getVideo = (quality: "hd" | "sd" | null) => {
                    if (video?.video_files.find((f) => f.quality === null)) {
                      return video?.video_files.sort((a, b) => (b as any).size - (a as any).size)[0]?.link;
                    }
                    return video?.video_files.filter((f) => f.quality === quality)[0]?.link;
                  };
                  const videoLink = getVideo("hd") ?? getVideo("sd") ?? getVideo(null);

                  return (
                    <Box
                      key={key}
                      ref={key === (totalVideos ?? 0) - 1 ? ref : undefined}
                      className={cn(
                        "relative h-48 overflow-hidden rounded-md group",
                        editor?.getAttributes("video").src === videoLink && "outline-2 outline-offset-2 outline-blue-500 sticky top-0 z-10",
                      )}
                    >
                      <NextImage
                        blurDataURL={video?.image}
                        src={video?.image ?? ""}
                        fill
                        alt={video?.user.name ?? ""}
                        objectFit="cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <Stack className="opacity-0 transition-all! duration-200 group group-hover:opacity-100 absolute p-3 inset-0 bg-linear-to-t from-black/80 via-black via-5% to-transparent backdrop-blur-xs">
                        <ShadButton
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .setVideo({
                                src: videoLink ?? "",
                              })
                              .run()
                          }
                          size="icon-sm"
                          variant={editor?.getAttributes("image").title === video?.id.toString() ? "default" : "secondary"}
                          className="ml-auto shadow-none rounded-full"
                        >
                          {editor?.getAttributes("image").title === video?.id.toString() ? <Check /> : <Plus />}
                        </ShadButton>
                        <a
                          className="mt-auto mx-auto text-sm capitalize flex gap-0 items-center flex-wrap"
                          href={video?.url}
                          target="_black"
                        >
                          <span className="text-gray-400 mr-1">video by</span>
                          <Flex className="gap-1">
                            <span className="text-white hover:underline truncate">{video?.user.name}</span>
                            <ExternalLink className="size-4 transition-all! group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white delay-200!" />
                          </Flex>
                        </a>
                      </Stack>
                    </Box>
                  );
                })}
            </Box>
            {(isFetchingNextPage || isLoading || isFetching) && (
              <Flex className="border border-blue-200 bg-blue-100 col-span-2 h-fit rounded-sm p-2 mx-2 mb-2">
                <Flex className="m-auto text-blue-500">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm">loading Images...</span>
                </Flex>
              </Flex>
            )}
          </Stack>
        </SheetContent>
      </Sheet>
    </>
  );
}
