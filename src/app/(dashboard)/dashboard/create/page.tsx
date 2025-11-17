import { Stack } from "@/ui/stack";
import TiptapEditor from "../../components/tiptap/tiptap-editor";

export default function CreatePage() {
  return (
    <Stack className="scroll h-full">
      <TiptapEditor />
    </Stack>
  );
}
