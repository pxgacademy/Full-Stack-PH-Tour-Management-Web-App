import { cn } from "@/lib/utils";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import MenuBar from "./menu_bar";

interface RichTextEditorProps {
  content: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  editable?: boolean;
  error?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  editable = true,
  error = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },

        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Highlight,
    ],

    editorProps: {
      attributes: {
        class: editable
          ? cn(
              "min-h-96 border rounded-md p-3 bg-background focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ",
              {
                "border-destructive": error && (!content || content === "<p></p>"),
              }
            )
          : "text-muted-foreground",
      },
    },

    content,

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  return (
    <div>
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}
