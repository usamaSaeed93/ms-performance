"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";
import { useEffect, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your blog post...",
  editable = true,
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#1d70ff] hover:underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3 text-[#5c6c86]",
      },
    },
  });

  // Update editor content when content prop changes (for editing existing blogs)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  if (!mounted || !editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {editable && (
          <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        )}
        <div className="bg-white min-h-[400px] p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        </div>
      </div>
    );
  }

  const handleImageUpload = (url: string) => {
    editor.chain().focus().setImage({ src: url }).run();
  };

  const addImageFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Use a temporary data URL for preview, but ideally you'd upload it first
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          editor.chain().focus().setImage({ src: result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {editable && (
        <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-gray-200" : ""}
          >
            <strong>B</strong>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-gray-200" : ""}
          >
            <em>I</em>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}
          >
            H1
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
          >
            H2
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}
          >
            H3
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          >
            •
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          >
            1.
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
          >
            "
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const url = window.prompt("Enter URL:");
              if (url) {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }}
            className={editor.isActive("link") ? "bg-gray-200" : ""}
            title="Add link"
          >
            🔗
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
            title="Remove link"
          >
            🔗✕
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addImageFromFile}
            title="Insert image from file"
          >
            🖼️
          </Button>
          <div className="flex-1" />
          <div className="border-l border-gray-300 pl-2">
            <ImageUpload
              folder="blogs"
              onUploadComplete={handleImageUpload}
              multiple={false}
              buttonText="Upload & Insert Image"
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      )}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
      <style jsx global>{`
        .ProseMirror {
          min-height: 400px;
          padding: 1rem;
        }
        .ProseMirror p {
          margin: 1em 0;
          line-height: 1.75;
          color: #5c6c86;
        }
        .ProseMirror h1 {
          font-size: 2.25em;
          font-weight: 900;
          margin: 1em 0 0.5em 0;
          color: #0c1b33;
        }
        .ProseMirror h2 {
          font-size: 1.875em;
          font-weight: 800;
          margin: 1em 0 0.5em 0;
          color: #0c1b33;
        }
        .ProseMirror h3 {
          font-size: 1.5em;
          font-weight: 700;
          margin: 1em 0 0.5em 0;
          color: #0c1b33;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .ProseMirror li {
          margin: 0.5em 0;
          color: #5c6c86;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #1d70ff;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #5c6c86;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 2em 0;
        }
        .ProseMirror a {
          color: #1d70ff;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror a:hover {
          color: #1a5fdd;
        }
        .ProseMirror strong {
          font-weight: 700;
          color: #0c1b33;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: monospace;
        }
        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
        }
        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}

