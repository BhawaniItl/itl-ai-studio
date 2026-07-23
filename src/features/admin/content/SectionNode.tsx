import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SectionNodeData {
  id: string;
  title: string;
  parent_id?: string | null;
  sort_order: number;
  status: string;
  children?: SectionNodeData[];
}

interface SectionNodeProps {
  node: SectionNodeData;
  level: number;
  expanded: Record<string, boolean>;
  toggle(id: string): void;
  selectedId?: string;
  onSelect(node: SectionNodeData): void;
  onAddChild?(node: SectionNodeData): void;
  onEdit?(node: SectionNodeData): void;
  onDelete?(node: SectionNodeData): void;
}

export function SectionNode({
  node,
  level,
  expanded,
  toggle,
  selectedId,
  onSelect,
  onAddChild,
  onEdit,
  onDelete,
}: SectionNodeProps) {
  const hasChildren = !!node.children?.length;
  const open = expanded[node.id] ?? true;

  return (
    <div>
      <div
        className={`flex items-center rounded-md px-2 py-1.5 cursor-pointer hover:bg-muted ${
          selectedId === node.id ? "bg-primary text-primary-foreground" : ""
        }`}
        style={{ paddingLeft: 12 + level * 18 }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="mr-1 rounded-sm p-0.5 text-current"
            aria-label={open ? `Collapse ${node.title}` : `Expand ${node.title}`}
            onClick={(event) => {
              event.stopPropagation();
              toggle(node.id);
            }}
          >
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="mr-5" />
        )}

        {hasChildren ? (
          open ? (
            <FolderOpen className="mr-2 h-4 w-4" />
          ) : (
            <Folder className="mr-2 h-4 w-4" />
          )
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}

        <span className="flex-1 truncate">{node.title}</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Actions for ${node.title}`}
              className="rounded-sm p-1 text-current hover:bg-background/60"
              onClick={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddChild?.(node)}>Add Child</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(node)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(node)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && open && (
        <div>
          {node.children!.map((child) => (
            <SectionNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              toggle={toggle}
              selectedId={selectedId}
              onSelect={onSelect}
              onAddChild={onAddChild}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
