import { useInfiniteQuery } from "@tanstack/react-query";
import type { PhotosWithTotalResults } from "pexels";
import * as pexels from "pexels";

const client = pexels.createClient(process.env.NEXT_PUBLIC_PEXELS_API_KEY!);

interface PexelsQueryParams {
  perPage?: number;
  enabled: boolean;
  query: string;
}

export const usePexels = ({ query, perPage = 15, enabled = false }: PexelsQueryParams) => {
  return useInfiniteQuery({
    enabled,
    queryKey: ["pexels", query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = (await client.photos.search({
        query,
        per_page: perPage,
        page: pageParam,
      })) as PhotosWithTotalResults;

      return {
        ...response,
        page: pageParam,
      };
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      const maxPages = Math.ceil((lastPage as PhotosWithTotalResults).total_results / (lastPage as PhotosWithTotalResults).per_page);
      return nextPage <= maxPages ? nextPage : undefined;
    },
    initialPageParam: 1,
  });
};
