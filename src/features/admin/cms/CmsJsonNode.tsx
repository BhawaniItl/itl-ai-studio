/* eslint-disable prettier/prettier */
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Check,
  X,
  Braces,
  Brackets,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  JSON_TYPE_OPTIONS,
  countJsonKeys,
  getJsonType,
  type CmsJsonAction,
  type JsonPath,
} from "./cms-json-utils";
import type { CmsJsonObject, CmsJsonType, CmsJsonValue } from "@/types/cms";

interface CmsJsonNodeProps {
  value: CmsJsonValue;
  path: JsonPath;
  depth: number;
  dispatch: (action: CmsJsonAction) => void;
  readOnly?: boolean;
  /** Length of the parent array — only meaningful when this node is an array item. */
  arraySiblingCount?: number;
}

export function CmsJsonNode({
  value,
  path,
  depth,
  dispatch,
  readOnly = false,
  arraySiblingCount,
}: CmsJsonNodeProps) {
  const [expanded, setExpanded] = useState(depth < 3);
  const type = getJsonType(value);
  const isRoot = path.length === 0;
  const own = path[path.length - 1];
  const isArrayItem = typeof own === "number";
  const isObjectProp = typeof own === "string";
  const parentPath = path.slice(0, -1);
  const isContainer = type === "object" || type === "array";
  const childCount = countJsonKeys(value);

  const remove = () => dispatch({ type: "removeAt", path });
  const move = (direction: -1 | 1) =>
    dispatch({ type: "moveArrayItem", path: parentPath, index: own as number, direction });

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-secondary/60",
        )}
        style={{ paddingLeft: depth * 16 }}
      >
        {isContainer ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground hover:bg-secondary"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="h-5 w-5 shrink-0" />
        )}

        {isObjectProp && !isRoot && (
          <KeyLabel
            keyName={own as string}
            readOnly={readOnly}
            onRename={(newKey) =>
              dispatch({ type: "renameObjectKey", path: parentPath, oldKey: own as string, newKey })
            }
          />
        )}

        {isArrayItem && (
          <Badge
            variant="outline"
            className="h-5 shrink-0 px-1.5 font-mono text-[10px] text-muted-foreground"
          >
            {own}
          </Badge>
        )}

        {isContainer ? (
          <span className="flex min-w-0 flex-1 items-center gap-1.5 text-xs text-muted-foreground">
            {type === "object" ? (
              <Braces className="h-3 w-3 shrink-0" />
            ) : (
              <Brackets className="h-3 w-3 shrink-0" />
            )}
            <span className="truncate">
              {type} · {childCount}{" "}
              {type === "object"
                ? childCount === 1
                  ? "key"
                  : "keys"
                : childCount === 1
                  ? "item"
                  : "items"}
            </span>
          </span>
        ) : (
          <PrimitiveValueEditor
            value={value}
            readOnly={readOnly}
            onChangeValue={(next) => dispatch({ type: "setValue", path, value: next })}
            onChangeType={(t) => dispatch({ type: "changePrimitiveType", path, valueType: t })}
          />
        )}

        {!readOnly && !isRoot && (
          <div className="ml-auto flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            {isArrayItem && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="Move up"
                  disabled={(own as number) === 0}
                  onClick={() => move(-1)}
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  title="Move down"
                  disabled={(own as number) === (arraySiblingCount ?? 1) - 1}
                  onClick={() => move(1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              title={isArrayItem ? "Delete item" : "Delete property"}
              onClick={remove}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {isContainer && expanded && (
        <div className="ml-3 border-l border-border/50">
          {type === "object" &&
            Object.entries(value as CmsJsonObject).map(([key, child]) => (
              <CmsJsonNode
                key={key}
                value={child}
                path={[...path, key]}
                depth={depth + 1}
                dispatch={dispatch}
                readOnly={readOnly}
              />
            ))}

          {type === "array" &&
            (value as CmsJsonValue[]).map((child, index) => (
              <CmsJsonNode
                key={index}
                value={child}
                path={[...path, index]}
                depth={depth + 1}
                dispatch={dispatch}
                readOnly={readOnly}
                arraySiblingCount={(value as CmsJsonValue[]).length}
              />
            ))}

          {!readOnly && (
            <div style={{ paddingLeft: (depth + 1) * 16 }} className="py-1">
              {type === "object" ? (
                <AddObjectPropertyRow
                  existingKeys={Object.keys(value as CmsJsonObject)}
                  onAdd={(key, valueType) =>
                    dispatch({ type: "addObjectKey", path, key, valueType })
                  }
                />
              ) : (
                <AddArrayItemMenu
                  onAdd={(valueType) => dispatch({ type: "addArrayItem", path, valueType })}
                />
              )}
            </div>
          )}

          {isContainer && childCount === 0 && readOnly && (
            <p
              style={{ paddingLeft: (depth + 1) * 16 }}
              className="py-1 text-xs text-muted-foreground"
            >
              Empty {type}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function KeyLabel({
  keyName,
  readOnly,
  onRename,
}: {
  keyName: string;
  readOnly: boolean;
  onRename: (newKey: string) => void;
}) {
  const [draft, setDraft] = useState(keyName);

  if (readOnly) {
    return (
      <span className="shrink-0 font-mono text-xs font-semibold text-foreground">{keyName}</span>
    );
  }

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === keyName) {
      setDraft(keyName);
      return;
    }
    onRename(trimmed);
  };

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") setDraft(keyName);
      }}
      className="w-auto min-w-[3ch] max-w-[220px] shrink-0 rounded border border-transparent bg-transparent px-1 font-mono text-xs font-semibold text-foreground outline-none hover:border-border focus:border-primary focus:bg-background"
      style={{ width: `${Math.max(3, draft.length + 1)}ch` }}
    />
  );
}

function PrimitiveValueEditor({
  value,
  readOnly,
  onChangeValue,
  onChangeType,
}: {
  value: CmsJsonValue;
  readOnly: boolean;
  onChangeValue: (next: CmsJsonValue) => void;
  onChangeType: (type: CmsJsonType) => void;
}) {
  const type = getJsonType(value);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      {type === "boolean" ? (
        <Switch
          checked={value as boolean}
          disabled={readOnly}
          onCheckedChange={(c) => onChangeValue(c)}
        />
      ) : type === "null" ? (
        <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs italic text-muted-foreground">
          null
        </span>
      ) : type === "number" ? (
        <Input
          type="number"
          value={value as number}
          disabled={readOnly}
          onChange={(e) => onChangeValue(e.target.value === "" ? 0 : Number(e.target.value))}
          className="h-7 max-w-[160px] font-mono text-xs"
        />
      ) : (
        <Input
          value={value as string}
          disabled={readOnly}
          onChange={(e) => onChangeValue(e.target.value)}
          className="h-7 min-w-0 flex-1 font-mono text-xs"
          placeholder="empty string"
        />
      )}

      {!readOnly && (
        <Select value={type} onValueChange={(t) => onChangeType(t as CmsJsonType)}>
          <SelectTrigger className="h-7 w-[88px] shrink-0 px-2 text-[11px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {JSON_TYPE_OPTIONS.filter((o) => o.value !== "object" && o.value !== "array").map(
              (opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function AddObjectPropertyRow({
  existingKeys,
  onAdd,
}: {
  existingKeys: string[];
  onAdd: (key: string, type: CmsJsonType) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [key, setKey] = useState("");
  const [type, setType] = useState<CmsJsonType>("string");
  const duplicate = key.trim().length > 0 && existingKeys.includes(key.trim());

  if (!adding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
        onClick={() => setAdding(true)}
      >
        <Plus className="h-3 w-3" /> Add property
      </Button>
    );
  }

  const confirm = () => {
    const trimmed = key.trim();
    if (!trimmed || duplicate) return;
    onAdd(trimmed, type);
    setKey("");
    setType("string");
    setAdding(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Input
        autoFocus
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirm();
          if (e.key === "Escape") setAdding(false);
        }}
        placeholder="propertyName"
        className={cn("h-7 w-40 font-mono text-xs", duplicate && "border-destructive")}
      />
      <Select value={type} onValueChange={(t) => setType(t as CmsJsonType)}>
        <SelectTrigger className="h-7 w-[100px] px-2 text-[11px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {JSON_TYPE_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        disabled={!key.trim() || duplicate}
        onClick={confirm}
      >
        <Check className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAdding(false)}>
        <X className="h-3.5 w-3.5" />
      </Button>
      {duplicate && <span className="text-[11px] text-destructive">Key already exists</span>}
    </div>
  );
}

function AddArrayItemMenu({ onAdd }: { onAdd: (type: CmsJsonType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 gap-1.5 px-2 text-[11px] text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-3 w-3" /> Add item
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {JSON_TYPE_OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt.value} onClick={() => onAdd(opt.value)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}