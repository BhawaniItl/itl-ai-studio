import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api, endpoints } from "@/services/api/api";

export interface BookRecord { id: string; name: string; slug: string; description?: string | null; status: string; sort_order: number; }
interface BookDialogProps { open: boolean; mode: "create" | "edit"; book?: BookRecord | null; onOpenChange: (open: boolean) => void; onSaved?: (book: BookRecord) => void; }

const createSchema = z.object({ name: z.string().trim().min(1, "Name is required."), description: z.string().trim() });
const editSchema = createSchema.extend({ slug: z.string().trim().min(1, "Slug is required."), status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]), sort_order: z.string().regex(/^\d+$/, "Sort order must be a whole number.") });
type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
async function nextSortOrder() {
  let page = 1; let maximum = -1; let total = 0;
  do { const { data } = await api.get<{ items?: BookRecord[]; total?: number }>(endpoints.books.list, { params: { page, limit: 100 } }); const items = data.items ?? []; maximum = Math.max(maximum, ...items.map((book) => book.sort_order)); total = data.total ?? items.length; page += 1; } while ((page - 1) * 100 < total);
  return maximum + 1;
}

export function BookDialog({ open, mode, book, onOpenChange, onSaved }: BookDialogProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{mode === "edit" ? "Edit Book" : "Create Book"}</DialogTitle><DialogDescription>{mode === "edit" ? "Update the selected book metadata." : "Create a book. Its slug, status, and sort order are assigned automatically."}</DialogDescription></DialogHeader>{mode === "edit" && book ? <EditBookForm book={book} onOpenChange={onOpenChange} onSaved={onSaved} /> : <CreateBookForm onOpenChange={onOpenChange} onSaved={onSaved} />}</DialogContent></Dialog>;
}

function CreateBookForm({ onOpenChange, onSaved }: Pick<BookDialogProps, "onOpenChange" | "onSaved">) {
  const queryClient = useQueryClient(); const form = useForm<CreateValues>({ resolver: zodResolver(createSchema), defaultValues: { name: "", description: "" } });
  useEffect(() => { form.reset({ name: "", description: "" }); }, [form]);
  const mutation = useMutation({ mutationFn: async (values: CreateValues) => { const payload = { name: values.name, description: values.description || null, slug: slugify(values.name), status: "ACTIVE", sort_order: await nextSortOrder() }; const { data } = await api.post<BookRecord>(endpoints.books.create, payload); return data; }, onSuccess: async (created) => { await queryClient.invalidateQueries({ queryKey: ["books"] }); toast.success("Book created successfully."); onSaved?.(created); onOpenChange(false); }, onError: () => toast.error("Failed to create book.") });
  return <Form {...form}><form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4"><FormField control={form.control} name="name" render={({ field }) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input autoFocus placeholder="Book name" {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} placeholder="Short description" {...field} /></FormControl><FormMessage /></FormItem>} /><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Creating..." : "Create Book"}</Button></DialogFooter></form></Form>;
}

function EditBookForm({ book, onOpenChange, onSaved }: { book: BookRecord; onOpenChange: (open: boolean) => void; onSaved?: (book: BookRecord) => void }) {
  const queryClient = useQueryClient(); const form = useForm<EditValues>({ resolver: zodResolver(editSchema), defaultValues: { name: book.name, description: book.description ?? "", slug: book.slug, status: book.status as EditValues["status"], sort_order: String(book.sort_order) } });
  useEffect(() => { form.reset({ name: book.name, description: book.description ?? "", slug: book.slug, status: book.status as EditValues["status"], sort_order: String(book.sort_order) }); }, [book, form]);
  const mutation = useMutation({ mutationFn: async (values: EditValues) => { const { data } = await api.put<BookRecord>(endpoints.books.update(book.id), { ...values, description: values.description || null, sort_order: Number(values.sort_order) }); return data; }, onSuccess: async (updated) => { await queryClient.invalidateQueries({ queryKey: ["books"] }); toast.success("Book updated successfully."); onSaved?.(updated); onOpenChange(false); }, onError: () => toast.error("Failed to update book.") });
  return <Form {...form}><form onSubmit={form.handleSubmit((values) => mutation.mutate(values))} className="space-y-4"><div className="grid gap-4 md:grid-cols-2"><FormField control={form.control} name="name" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Name</FormLabel><FormControl><Input autoFocus {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="slug" render={({ field }) => <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="sort_order" render={({ field }) => <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input inputMode="numeric" {...field} /></FormControl><FormMessage /></FormItem>} /><FormField control={form.control} name="status" render={({ field }) => <FormItem><FormLabel>Status</FormLabel><Select value={field.value} onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="ACTIVE">Active</SelectItem><SelectItem value="DRAFT">Draft</SelectItem><SelectItem value="ARCHIVED">Archived</SelectItem></SelectContent></Select><FormMessage /></FormItem>} /><FormField control={form.control} name="description" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>} /></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Saving..." : "Save Changes"}</Button></DialogFooter></form></Form>;
}
