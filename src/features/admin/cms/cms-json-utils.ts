/* eslint-disable prettier/prettier */
import type { CmsJsonObject, CmsJsonType, CmsJsonValue } from "@/types/cms";

/** A path into a CmsJsonValue tree — object keys and/or array indices, root-to-leaf. */
export type JsonPath = (string | number)[];

export function getJsonType(value: CmsJsonValue): CmsJsonType {
  if (value === null || value === undefined) return "null";
  if (Array.isArray(value)) return "array";
  switch (typeof value) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "object";
  }
}

export function defaultValueForType(type: CmsJsonType): CmsJsonValue {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object":
      return {};
    case "array":
      return [];
    case "null":
    default:
      return null;
  }
}

export const JSON_TYPE_OPTIONS: { value: CmsJsonType; label: string }[] = [
  { value: "string", label: "String" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "null", label: "Null" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
];

/** Recursively clones `root` and replaces the value at `path` with `updater(currentValue)`. */
export function updateAtPath<T extends CmsJsonValue>(
  root: T,
  path: JsonPath,
  updater: (value: CmsJsonValue) => CmsJsonValue,
): T {
  if (path.length === 0) return updater(root) as T;

  const [key, ...rest] = path;

  if (Array.isArray(root)) {
    const index = Number(key);
    const next = root.slice();
    next[index] = updateAtPath(next[index], rest, updater);
    return next as T;
  }

  if (root && typeof root === "object") {
    const obj = root as CmsJsonObject;
    const next: CmsJsonObject = { ...obj };
    next[String(key)] = updateAtPath(obj[String(key)], rest, updater);
    return next as T;
  }

  // Path points into a primitive — nothing to descend into, return unchanged.
  return root;
}

export function getAtPath(root: CmsJsonValue, path: JsonPath): CmsJsonValue {
  let current = root;
  for (const key of path) {
    if (Array.isArray(current)) current = current[Number(key)];
    else if (current && typeof current === "object")
      current = (current as CmsJsonObject)[String(key)];
    else return undefined as unknown as CmsJsonValue;
  }
  return current;
}

/** Discriminated actions the recursive editor dispatches; applied immutably via `applyJsonAction`. */
export type CmsJsonAction =
  | { type: "setValue"; path: JsonPath; value: CmsJsonValue }
  | { type: "changePrimitiveType"; path: JsonPath; valueType: CmsJsonType }
  | { type: "removeAt"; path: JsonPath }
  | { type: "addObjectKey"; path: JsonPath; key: string; valueType: CmsJsonType }
  | { type: "renameObjectKey"; path: JsonPath; oldKey: string; newKey: string }
  | { type: "addArrayItem"; path: JsonPath; valueType: CmsJsonType }
  | { type: "moveArrayItem"; path: JsonPath; index: number; direction: -1 | 1 };

export function applyJsonAction<T extends CmsJsonValue>(root: T, action: CmsJsonAction): T {
  switch (action.type) {
    case "setValue":
      return updateAtPath(root, action.path, () => action.value);

    case "changePrimitiveType":
      return updateAtPath(root, action.path, () => defaultValueForType(action.valueType));

    case "removeAt": {
      const parentPath = action.path.slice(0, -1);
      const key = action.path[action.path.length - 1];
      return updateAtPath(root, parentPath, (parent) => {
        if (Array.isArray(parent)) {
          const next = parent.slice();
          next.splice(Number(key), 1);
          return next;
        }
        if (parent && typeof parent === "object") {
          const next = { ...(parent as CmsJsonObject) };
          delete next[String(key)];
          return next;
        }
        return parent;
      });
    }

    case "addObjectKey":
      return updateAtPath(root, action.path, (value) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) return value;
        const obj = value as CmsJsonObject;
        if (action.key in obj) return obj;
        return { ...obj, [action.key]: defaultValueForType(action.valueType) };
      });

    case "renameObjectKey":
      return updateAtPath(root, action.path, (value) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) return value;
        const obj = value as CmsJsonObject;
        if (action.oldKey === action.newKey || action.newKey in obj) return obj;
        const entries = Object.entries(obj).map(([k, v]): [string, CmsJsonValue] =>
          k === action.oldKey ? [action.newKey, v] : [k, v],
        );
        return Object.fromEntries(entries);
      });

    case "addArrayItem":
      return updateAtPath(root, action.path, (value) => {
        if (!Array.isArray(value)) return value;
        return [...value, defaultValueForType(action.valueType)];
      });

    case "moveArrayItem":
      return updateAtPath(root, action.path, (value) => {
        if (!Array.isArray(value)) return value;
        const next = value.slice();
        const swap = action.index + action.direction;
        if (swap < 0 || swap >= next.length) return next;
        [next[action.index], next[swap]] = [next[swap], next[action.index]];
        return next;
      });

    default:
      return root;
  }
}

/** Route slugs are used verbatim as the URL path segment — keep them predictable. */
export function isValidRoute(route: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(route.trim());
}

export function countJsonKeys(value: CmsJsonValue): number {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object") return Object.keys(value).length;
  return 0;
}