import { useInfiniteQuery } from "@tanstack/react-query";
import type { PhotosWithTotalResults, Videos } from "pexels";
import * as pexels from "pexels";

const client = pexels.createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY!);
export type Type = "image" | "video";

interface PexelsQueryParams {
  type?: Type;
  perPage?: number;
  enabled: boolean;
  query: string;
}

interface Response extends Omit<PhotosWithTotalResults, "photos">, Omit<Videos, "videos"> {
  videos?: pexels.Video;
  photos?: pexels.Photo;
}

export const usePexels = ({ query, perPage = 15, enabled = false, type = "image" }: PexelsQueryParams) => {
  return useInfiniteQuery({
    enabled,
    queryKey: ["pexels", type, query],
    queryFn: async ({ pageParam = 1 }) => {
      if (type === "video") {
        const response = (await client.videos.search({
          query,
          per_page: perPage,
          page: pageParam,
        })) as unknown as Response;
        return {
          ...response,
          page: pageParam,
        };
      } else {
        const response = (await client.photos.search({
          query,
          per_page: perPage,
          page: pageParam,
        })) as unknown as Response;
        return {
          ...response,
          page: pageParam,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      const maxPages = Math.ceil((lastPage.total_results as number) / (lastPage.per_page as number));
      return nextPage <= maxPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
  });
};
