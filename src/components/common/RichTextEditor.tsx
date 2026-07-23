import { ClientOnly } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import "@/components/editor/ckeditor.css";

type CkeditorReactModule = typeof import("@ckeditor/ckeditor5-react");
type CkeditorModule = typeof import("ckeditor5");
type EditorConfig = import("ckeditor5").EditorConfig;

interface EditorModules {
  react: CkeditorReactModule;
  editor: CkeditorModule;
}

interface RichTextEditorProps {
  content: string;
  onChange: (html: string, text: string) => void;
}

const LICENSE_KEY = "GPL";

export function RichTextEditor(props: RichTextEditorProps) {
  return (
    <ClientOnly fallback={<EditorLoadingState />}>
      <RichTextEditorClient {...props} />
    </ClientOnly>
  );
}

function EditorLoadingState() {
  return (
    <div className="rich-text-editor w-full rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
      Loading editor…
    </div>
  );
}

function RichTextEditorClient({ content, onChange }: RichTextEditorProps) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [modules, setModules] = useState<EditorModules | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLayoutReady(true);

    Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("ckeditor5"),
      import("ckeditor5/ckeditor5.css"),
    ]).then(([reactModule, editorModule]) => {
      if (isMounted) setModules({ react: reactModule, editor: editorModule });
    });

    return () => {
      isMounted = false;
      setIsLayoutReady(false);
    };
  }, []);

  const editorConfig = useMemo<EditorConfig | null>(() => {
    if (!isLayoutReady || !modules) return null;

    const {
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BlockQuote,
      Bold,
      CloudServices,
      Code,
      Emoji,
      Essentials,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Fullscreen,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      ImageBlock,
      ImageCaption,
      ImageEditing,
      ImageInline,
      ImageInsertViaUrl,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImageUtils,
      Indent,
      PasteFromOffice,
      ListProperties,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      MediaEmbed,
      Mention,
      Paragraph,
      PasteFromMarkdownExperimental,
      PlainTableOutput,
      ShowBlocks,
      SourceEditing,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      TodoList,
      Underline,
    } = modules.editor;

    return {
      licenseKey: LICENSE_KEY,
      placeholder: "Type or paste your content here…",
      toolbar: {
        items: [
          "undo",
          "redo",
          "|",
          "sourceEditing",
          "showBlocks",
          "textPartLanguage",
          "fullscreen",
          "|",
          "heading",
          "style",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "fontBackgroundColor",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "code",
          "|",
          "emoji",
          "horizontalLine",
          "link",
          "insertImageViaUrl",
          "mediaEmbed",
          "insertTable",
          "highlight",
          "blockQuote",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "todoList",
          "outdent",
          "indent",
        ],
        shouldNotGroupWhenFull: true,
      },
      plugins: [
        Alignment,
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        BlockQuote,
        Bold,
        CloudServices,
        Code,
        Emoji,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Fullscreen,
        GeneralHtmlSupport,
        Heading,
        Highlight,
        HorizontalLine,
        HtmlComment,
        ImageBlock,
        ImageCaption,
        ImageEditing,
        ImageInline,
        ImageInsertViaUrl,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        ImageUtils,
        Indent,
        PasteFromOffice,
        ListProperties,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromMarkdownExperimental,
        PlainTableOutput,
        ShowBlocks,
        SourceEditing,
        Strikethrough,
        Style,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableToolbar,
        TextPartLanguage,
        TextTransformation,
        TodoList,
        Underline,
      ],
      fontFamily: { supportAllValues: true },
      fontSize: {
        options: [10, 12, 14, "default", 18, 20, 22, 24, 28, 32, 36],
        supportAllValues: true,
      },
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
          { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
          { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
          { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
        ],
      },
      htmlSupport: {
        allow: [
          {
            name: /.*/,
            styles: {
              "line-height": true,
              margin: true,
              "margin-top": true,
              "margin-bottom": true,
              padding: true,
              "padding-left": true,
              "font-size": true,
              "font-family": true,
              "text-indent": true,
            },
            attributes: true,
            classes: true,
          },
        ],
      },
      style: {
        definitions: [
          {
            name: "Paragraph Large",
            element: "p",
            classes: ["large"],
          },
        ],
      },
      image: {
        toolbar: [
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "imageStyle:inline",
          "imageStyle:wrapText",
          "imageStyle:breakText",
        ],
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
      },
      menuBar: { isVisible: true },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
          "toggleTableCaption",
        ],
      },
    };
  }, [isLayoutReady, modules]);

  const CKEditor = modules?.react.CKEditor;
  const ClassicEditor = modules?.editor.ClassicEditor;

  return (
    <div className="rich-text-editor w-full rounded-lg border border-border bg-background">
      {CKEditor && ClassicEditor && editorConfig ? (
        <CKEditor
          editor={ClassicEditor}
          config={editorConfig}
          data={content || ""}
          onChange={(_event, editor) => {
            const html = editor.getData();
            const tmp = document.createElement("div");
            tmp.innerHTML = html;
            const text = tmp.textContent || tmp.innerText || "";
            onChange(html, text);
          }}
        />
      ) : (
        <EditorLoadingState />
      )}
    </div>
  );
}
