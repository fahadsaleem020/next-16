import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { FileWithPath } from "react-dropzone";
import { useGlobalDropzone } from "@/providers/dropzone.provider";
import { Box } from "@/ui/box";
import { Stack } from "@/ui/stack";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { cn } from "@/utils/cn";

export default function ThumbnailForm() {
  const { getRootProps, getInputProps, acceptedFiles, open, isDragReject } = useGlobalDropzone();
  const [files, setFiles] = useState<readonly FileWithPath[]>([]);

  useEffect(() => {
    if (acceptedFiles.length) {
      setFiles(acceptedFiles);
    }
  }, [acceptedFiles]);

  return (
    <Stack {...getRootProps} className="px-4 pt-4">
      <h1 className="font-medium">
        Thumbnails {isDragReject && <span className="text-xs text-destructive">Max 3 files are allowed.</span>}
      </h1>
      <Box className="grid grid-cols-4 gap-2">
        {files.map((file, key) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Box onClick={open} className={cn("relative rounded-md cursor-pointer", key === 0 ? "col-span-4  h-48" : "col-span-2  h-32")}>
                <Image key={key} src={URL.createObjectURL(file)} alt={`Thumbnail ${key + 2}`} fill className="object-cover rounded-lg" />
              </Box>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to replace images</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {!files.length &&
          Array.from({ length: 3 }).map((_, key) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Box
                  onClick={open}
                  className={cn(
                    "bg-gray-300 dark:bg-sidebar-border rounded-md cursor-pointer flex",
                    key === 0 ? "col-span-4  h-48" : "col-span-2  h-32",
                  )}
                >
                  <ImageIcon className="m-auto size-10 text-gray-400 dark:text-sidebar-border" />
                </Box>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to add images</p>
              </TooltipContent>
            </Tooltip>
          ))}
        <input {...getInputProps()} />
      </Box>
    </Stack>
  );
}
