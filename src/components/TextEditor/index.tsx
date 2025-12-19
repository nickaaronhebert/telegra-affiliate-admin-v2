// Importing helper modules
import { useMemo, useRef } from "react";

// Importing core components
import QuillEditor from "react-quill";

// Importing styles
import "react-quill/dist/quill.snow.css";

import type ReactQuill from "react-quill";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  setValue: (arg: string) => void;
  title?: string;
  titleClass?: string;
}
const Editor = ({ value, setValue, title, titleClass = "" }: EditorProps) => {
  // Editor state
  // const [value, setValue] = useState(
  //   "<p><strong><ins>This is another template for Lab Orders<br></ins></strong>Lab Order 1</p>\n<p><em>Lab Order 2</em></p>\n<p>Lab Order 3</p>\n"
  // );

  // Editor ref
  const quill = useRef<ReactQuill | null>(null);

  // Handler to handle button clicked

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link"],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "color",
    "clean",
  ];

  return (
    <div className="bg-white ">
      {title && <label className={cn("", titleClass)}>{title}</label>}

      <QuillEditor
        ref={(el) => {
          quill.current = el;
        }}
        theme="snow"
        value={value}
        formats={formats}
        modules={modules}
        onChange={(value) => setValue(value)}
      />
    </div>
  );
};

export default Editor;
