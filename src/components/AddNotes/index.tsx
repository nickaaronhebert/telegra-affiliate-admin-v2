import { useViewUserNotesTemplatesQuery } from "@/redux/services/notes";
import { useState } from "react";

import { LoadingSpinner } from "../ui/loading-spinner";
import { Dropdown } from "../DropDown";
import { Button } from "../ui/button";
import Editor from "../TextEditor";

type template_state = "create_new_template" | "edit_new_template";

export default function AddNotes() {
  //   const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [templateState, setTemplateState] = useState<template_state>(
    "create_new_template"
  );
  const [templateContent, setTemplateContent] = useState("");

  console.log({ value, templateContent, templateState });

  const { data, isLoading } = useViewUserNotesTemplatesQuery(undefined, {
    selectFromResult: ({ data, isLoading }) => {
      return {
        // Add the fields you want to return here
        data: data?.map((item) => {
          return {
            ...item,
            label: item.noteTitle,
            value: item.id,
          };
        }),
        isLoading,
      };
    },
  });

  //   const handleSelect = (currentValue: string) => {
  //     setValue(currentValue);
  //     setOpen(false);
  //   };

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="flex justify-end my-2 space-y-5">
            <Button
              variant={"secondary"}
              onClick={() => {
                setTemplateContent("");
                setValue("");
                setTemplateState("create_new_template");
              }}
              className="bg-black text-white hover:bg-black hover:text-white cursor-pointer"
            >
              Create New Template
            </Button>
          </div>

          <Dropdown
            options={data || []}
            placeholder="Select Existing Template"
            onChange={(option: any) => {
              setValue(option.value);
              setTemplateContent(option?.noteContent?.standardText);
            }}
          />

          <div className="my-4">
            <Editor
              value={templateContent}
              setValue={setTemplateContent}
              title=""
            />
          </div>
        </div>
      )}
    </div>
  );
}
