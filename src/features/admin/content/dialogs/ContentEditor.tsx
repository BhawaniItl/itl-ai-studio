import { RichTextEditor } from "@/components/common/RichTextEditor";

interface ContentEditorProps {
  content: string;
  onChange: (html: string, text: string) => void;
}

export function ContentEditor({ content, onChange }: ContentEditorProps) {
  return <RichTextEditor content={content} onChange={onChange} />;
}
