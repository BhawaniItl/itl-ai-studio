/* eslint-disable prettier/prettier */

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";
import { api, endpoints } from "@/services/api/api";
import { createFileRoute } from "@tanstack/react-router";
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    FileText,
    Plus,
    MoreHorizontal,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
export const Route = createFileRoute("/admin/content")({
  component: AdminContentPage,
  head: () => ({ meta: [{ title: "Content Management — Admin" }] }),
});

interface Book {

    id: string;

    name: string;

    slug: string;

    description?: string;

    status: string;

    sort_order: number;

    created_at: string;

    updated_at: string;

}

interface Section {

    id: string;

    title: string;

    parent_id?: string | null;

    sort_order: number;

    status: string;

    children?: Section[];

}

interface ContentItem {

    id: string;

    title: string;

    reference_no?: string;

    status: string;

    version: number;

    updated_at: string;

}

interface SectionNodeProps {

    node: Section;

    level: number;

    expanded: Record<string, boolean>;

    toggle(id: string): void;

    selectedId?: string;

    onSelect(node: Section): void;

}

async function fetchBooks(
    page: number,
    limit: number,
    search: string,
    status: string,
) {

    const { data } = await api.get(endpoints.books.list, {

        params: {

            page,

            limit,

            search: search || undefined,

            status: status === "ALL"
                ? undefined
                : status,

        },

    });

    return data;

}
async function fetchSections(bookId: string) {

    if (!bookId) return [];

    const { data } = await api.get(
        endpoints.books.tree(bookId)
    );

    return data;

}

function SectionNode({

    node,

    level,

    expanded,

    toggle,

    selectedId,

    onSelect,

}: SectionNodeProps) {

    const hasChildren =
        !!node.children?.length;

    const open =
        expanded[node.id] ?? true;

    return (

        <div>

            <div

                className={`

                    flex

                    items-center

                    rounded-md

                    px-2

                    py-1.5

                    cursor-pointer

                    hover:bg-muted

                    ${

                        selectedId === node.id

                            ? "bg-primary text-primary-foreground"

                            : ""

                    }

                `}

                style={{

                    paddingLeft:

                        12 + level * 18,

                }}

                onClick={() =>

                    onSelect(node)

                }

            >

                {

                    hasChildren ? (

                        <button

                            className="mr-1"

                            onClick={(e) => {

                                e.stopPropagation();

                                toggle(node.id);

                            }}

                        >

                            {

                                open

                                    ? <ChevronDown className="h-4 w-4"/>

                                    : <ChevronRight className="h-4 w-4"/>

                            }

                        </button>

                    ) : (

                        <span className="mr-5"/>

                    )

                }

                {

                    hasChildren

                        ? (

                            open

                                ? <FolderOpen className="mr-2 h-4 w-4"/>

                                : <Folder className="mr-2 h-4 w-4"/>

                        )

                        : (

                            <FileText className="mr-2 h-4 w-4"/>

                        )

                }

                <span className="flex-1 truncate">

                    {node.title}

                </span>

                <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                        <button

                            onClick={(e) =>

                                e.stopPropagation()

                            }

                        >

                            <MoreHorizontal className="h-4 w-4"/>

                        </button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                        <DropdownMenuItem>

                            Add Child

                        </DropdownMenuItem>

                        <DropdownMenuItem>

                            Edit

                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-red-600">

                            Delete

                        </DropdownMenuItem>

                    </DropdownMenuContent>

                </DropdownMenu>

            </div>

            {

                hasChildren && open && (

                    <div>

                        {

                            node.children!.map(

                                (child) => (

                                    <SectionNode

                                        key={child.id}

                                        node={child}

                                        level={level + 1}

                                        expanded={expanded}

                                        toggle={toggle}

                                        selectedId={selectedId}

                                        onSelect={onSelect}

                                    />

                                )

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}

export default function AdminContentPage() {

    const [page, setPage] = useState(1);

    const [limit] = useState(10);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("ALL");

    const [selectedBook, setSelectedBook] =
        useState<Book | null>(null);
    
    const [selectedSection, setSelectedSection] =
        useState<Section | null>(null);

    const [expanded, setExpanded] =
        useState<Record<string, boolean>>({});        

    const {

        data,

        isLoading,

        isFetching,

        refetch,

    } = useQuery({

        queryKey: [

            "books",

            page,

            limit,

            search,

            status,

        ],

        queryFn: () => fetchBooks(

            page,

            limit,

            search,

            status,

        ),

    });

    const toggleSection = (
        id: string,
    ) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const {
        data: sectionTree = [],
        isLoading: sectionsLoading,
        refetch: refetchSections,
    } = useQuery({
        queryKey: [
            "book-sections",
            selectedBook?.id,
        ],
        queryFn: () =>
            fetchSections(selectedBook!.id),
        enabled: !!selectedBook,
    });

    useEffect(() => {
        if (
            !selectedSection &&
            sectionTree.length
        ) {
            setSelectedSection(
                sectionTree[0]
            );
        }
    }, [
        sectionTree,
        selectedSection,
    ]);

    const books: Book[] = useMemo(
        () => data?.items ?? [],
        [data],
    );

    useEffect(() => {
        if (!selectedBook && books.length) {
            setSelectedBook(books[0]);
        }
    }, [
        books,
        selectedBook,
    ]);

        return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">

                        Books Management

                    </h1>

                    <p className="text-muted-foreground">

                        Manage Books, Sections and Contents

                    </p>

                </div>

                <Button>

                    <Plus className="mr-2 h-4 w-4"/>

                    New Book

                </Button>

            </div>

            <Card>

                <CardHeader>

                    <CardTitle>

                        Books

                    </CardTitle>

                </CardHeader>

                <CardContent>

                  <div className="space-y-6">

    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex flex-1 gap-3">

            <div className="relative flex-1 max-w-md">

                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

                <Input
                    className="pl-10"
                    placeholder="Search books..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <Select
                value={status}
                onValueChange={setStatus}
            >

                <SelectTrigger className="w-[180px]">

                    <SelectValue/>

                </SelectTrigger>

                <SelectContent>

                    <SelectItem value="ALL">

                        All Status

                    </SelectItem>

                    <SelectItem value="ACTIVE">

                        Active

                    </SelectItem>

                    <SelectItem value="DRAFT">

                        Draft

                    </SelectItem>

                    <SelectItem value="ARCHIVED">

                        Archived

                    </SelectItem>

                </SelectContent>

            </Select>

        </div>

        <Button
            variant="outline"
            onClick={() => refetch()}
        >

            Refresh

        </Button>

    </div>

    <Separator/>

    {
        isLoading ? (

            <div className="space-y-3">

                {Array.from({ length: 8 }).map((_, i) => (

                    <Skeleton
                        key={i}
                        className="h-12 w-full"
                    />

                ))}

            </div>

        ) : books.length === 0 ? (

            <div className="py-16 text-center">

                <BookOpen className="mx-auto h-14 w-14 text-muted-foreground"/>

                <h3 className="mt-4 text-lg font-semibold">

                    No Books Found

                </h3>

                <p className="text-muted-foreground">

                    Click "New Book" to create your first book.

                </p>

            </div>

        ) : (

            <Table>

                <TableHeader>

                    <TableRow>

                        <TableHead>

                            Book

                        </TableHead>

                        <TableHead>

                            Slug

                        </TableHead>

                        <TableHead>

                            Status

                        </TableHead>

                        <TableHead>

                            Created

                        </TableHead>

                    </TableRow>

                </TableHeader>

                <TableBody>

                    {

                        books.map((book) => (

                            <TableRow
                                key={book.id}
                                className={`cursor-pointer ${
                                    selectedBook?.id === book.id
                                        ? "bg-muted"
                                        : ""
                                }`}
                                onClick={() => setSelectedBook(book)}
                            >

                                <TableCell>

                                    <div>

                                        <div className="font-medium">

                                            {book.name}

                                        </div>

                                        <div className="text-xs text-muted-foreground">

                                            {book.description || "-"}

                                        </div>

                                    </div>

                                </TableCell>

                                <TableCell>

                                    {book.slug}

                                </TableCell>

                                <TableCell>

                                    <Badge
                                        variant={
                                            book.status === "ACTIVE"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >

                                        {book.status}

                                    </Badge>

                                </TableCell>

                                <TableCell>

                                    {

                                        new Date(book.created_at)
                                            .toLocaleDateString()

                                    }

                                </TableCell>

                            </TableRow>

                        ))

                    }

                </TableBody>

            </Table>

        )

    }

    {

        data && (

            <div className="flex items-center justify-between pt-4">

                <div className="text-sm text-muted-foreground">

                    Showing {books.length} of {data.total} books

                </div>

                <div className="flex gap-2">

                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >

                        Previous

                    </Button>

                    <Button
                        variant="outline"
                        disabled={page * limit >= data.total}
                        onClick={() => setPage((p) => p + 1)}
                    >

                        Next

                    </Button>

                </div>

            </div>

        )

    }

</div>

                </CardContent>

            </Card>

        </div>

    );

}