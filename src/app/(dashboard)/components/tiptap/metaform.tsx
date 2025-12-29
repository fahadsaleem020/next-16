import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCw } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/ui/field";
import { Flex } from "@/ui/flex";
import { Input } from "@/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Textarea } from "@/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

const formSchema = z.object({
  permalink: z.string().regex(/^[a-z0-9-]+$/, "Permalink can only contain lowercase letters, numbers, and dashes."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  title: z.string().min(3, "Title must be at least 3 characters."),
  status: z.enum(["ARCHIVED", "PUBLISHED", "DRAFT"]),
  disableComments: z.boolean().catch(false),
  featured: z.boolean().catch(false),
});

export default function MetaForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      permalink: "",
      disableComments: false,
      featured: false,
      status: "DRAFT",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Form submitted:", data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4 mt-5">
      <h1 className="font-medium">Meta</h1>
      <FieldGroup className="gap-2">
        {/* Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input {...field} placeholder="Enter title" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Textarea {...field} placeholder="Enter description" className="min-h-[100px]" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Permalink */}
        <Controller
          name="permalink"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup>
                <InputGroupInput {...field} placeholder="my-article-slug" />
                <InputGroupAddon align="inline-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => {
                          // regenerate slug logic here
                        }}
                      >
                        <RefreshCw className="size-4" />
                      </InputGroupButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Regenerate permalink</p>
                    </TooltipContent>
                  </Tooltip>
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription className="text-xs">Lowercase letters, numbers, and dashes only.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Options */}
      <FieldGroup className="gap-4 my-10">
        {/* Disable Comments */}
        <Controller
          name="disableComments"
          control={form.control}
          render={({ field }) => (
            <Field>
              <label htmlFor="disable-comments" className="flex items-center justify-between cursor-pointer select-none">
                <FieldLabel>Disable comments</FieldLabel>
                <Switch id="disable-comments" checked={field.value} onCheckedChange={field.onChange} />
              </label>
            </Field>
          )}
        />

        {/* Featured */}
        <Controller
          name="featured"
          control={form.control}
          render={({ field }) => (
            <Field>
              <label htmlFor="featured" className="flex items-center justify-between cursor-pointer select-none">
                <FieldLabel>Featured</FieldLabel> <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
              </label>
            </Field>
          )}
        />

        {/* Status*/}
        <Controller
          name="status"
          control={form.control}
          render={({ field }) => (
            <Field className="gap-1">
              <FieldLabel>Visiblity</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[200px] font-semibold">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
      </FieldGroup>

      <Flex className="sticky bottom-0 py-2 bg-background">
        <Button variant="outline" className="flex-1" type="button">
          Close
        </Button>
        <Button className="flex-1" type="submit">
          Save
        </Button>
      </Flex>
    </form>
  );
}
