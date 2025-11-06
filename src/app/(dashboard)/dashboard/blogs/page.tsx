import { BookText } from "lucide-react";
import { Box } from "@/ui/box";
import { Button } from "@/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/ui/item";
import { Stack } from "@/ui/stack";
import BlogsTable from "../../components/blogstable";

export default function BlogsPage() {
  return (
    <Stack className="overflow-auto gap-0">
      <Item className="py-3">
        <ItemMedia className="rounded-full p-2 bg-secondary text-secondary-foreground border">
          <BookText className="size-5" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-lg">Blogs </ItemTitle>
          <ItemDescription>Manage your blogs.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button>Create Article</Button>
        </ItemActions>
      </Item>

      <Box className="overflow-auto scroll w-[97%] mx-auto">
        <BlogsTable />
      </Box>
    </Stack>
  );
}
