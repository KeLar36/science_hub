import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "script",
  "list",
  "blockquote",
  "code-block",
  "align",
  "link",
  "image",
];

export default function PostContentForm({ content, setContent }) {
  return (
    <div className="flex flex-col gap-1.5 w-full p-5 bg-bg-secondary border border-border-color rounded-lg">
      <label className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
        Текст публікації
      </label>

      <div className="quill-editor-wrapper bg-bg-primary rounded-lg border border-border-color overflow-hidden focus-within:border-brand transition-all duration-200">
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          placeholder="Напишіть свою наукову працю або новину тут..."
          className="min-h-400px"
        />
      </div>
    </div>
  );
}
