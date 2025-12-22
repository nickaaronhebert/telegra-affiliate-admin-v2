import {
  useAddNotesMutation,
  useCreateNoteTemplateMutation,
  useUpdateNoteTemplateMutation,
  useViewUserNotesTemplatesQuery,
} from "@/redux/services/notes";
import { useCallback, useState } from "react";

import { LoadingSpinner } from "../ui/loading-spinner";
import { Dropdown } from "../DropDown";
import { Button } from "../ui/button";
import Editor from "../TextEditor";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface AddNotesProps {
  labOrderId?: string;
  patientId?: string;
  closeAction: (arg: boolean) => void;
}
type template_state = "create_new_template" | "edit_new_template";
type current_template = {
  name: string;
  id: string;
};

export default function AddNotes({ labOrderId, patientId, closeAction }: AddNotesProps) {
  //   const [open, setOpen] = useState(false);

  const relatedEntity = labOrderId || patientId || "";
  const relatedEntityModel = labOrderId ? "LabOrder" : "Patient";

  const [createNewTemplate, { isLoading: isCreateNewTemplateLoader }] =
    useCreateNoteTemplateMutation();

  const [updateTemplate, { isLoading: isUpdateTemplateLoader }] =
    useUpdateNoteTemplateMutation();

  const [addNotes, { isLoading: isAddNotesLoader }] = useAddNotesMutation();

  const [value, setValue] = useState<current_template>({ name: "", id: "" });
  const [templateState, setTemplateState] = useState<template_state>(
    "create_new_template"
  );
  const [templateContent, setTemplateContent] = useState("");

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

  const addNewTemplate = useCallback(async () => {
    await createNewTemplate({
      noteContent: {
        standardText: templateContent,
      },
      noteTitle: value?.name,
      noteType: "standard",
    })
      .unwrap()
      .then(() => {
        toast.success("Template Created Successfully", {
          duration: 1500,
        });
        setTemplateContent("");
        setValue((prev) => {
          return {
            ...prev,
            name: "",
            id: "",
          };
        });
        setTemplateState("create_new_template");
      })
      .catch((err) => {
        console.log("error", err);
        toast.error("Something went wrong", {
          duration: 1500,
        });
      });
  }, [value, templateContent, createNewTemplate]);

  const editTemplate = useCallback(async () => {
    await updateTemplate({
      noteContent: {
        standardText: templateContent,
      },
      noteTitle: value?.name,
      noteType: "standard",
      id: value?.id,
    })
      .unwrap()
      .then(() => {
        toast.success("Template Updated Successfully", {
          duration: 1500,
        });
      })
      .catch((err) => {
        console.log("error", err);
        toast.error("Something went wrong", {
          duration: 1500,
        });
      });
  }, [value, templateContent, updateTemplate]);

  const createNote = useCallback(async () => {
    const notePayload: any = {
      content: {
        standardText: templateContent,
      },
      noteType: "standard",
      subject: labOrderId ? "Lab Order Note" : "Patient Note",
      isPrivate: true,
      relatedEntityModel: relatedEntityModel,
      relatedEntity: relatedEntity,
    };

    // Add patient field for patient notes
    if (patientId) {
      notePayload.patient = patientId;
    }

    await addNotes(notePayload)
      .unwrap()
      .then(() => {
        toast.success("Note Added Successfully", {
          duration: 1500,
        });
        closeAction(false);
      })
      .catch((err) => {
        console.log("error", err);
        toast.error("Something went wrong", {
          duration: 1500,
        });
      });
  }, [value, templateContent, addNotes, relatedEntity, relatedEntityModel, labOrderId, patientId]);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-48">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <div className="flex justify-end my-2 space-y-5">
            <Button
              variant={"secondary"}
              onClick={() => {
                setTemplateContent("");
                setValue((prev) => {
                  return {
                    ...prev,
                    name: "",
                    id: "",
                  };
                });
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
              setValue((prev) => {
                return {
                  ...prev,
                  name: option?.label,
                  id: option?.value,
                };
              });
              setTemplateContent(option?.noteContent?.standardText);
              setTemplateState("edit_new_template");
            }}
          />

          <div className="my-4 p-4 rounded-[6px] bg-secondary">
            <h4 className="font-semibold text-base ">
              {templateState === "create_new_template"
                ? "Create New Template"
                : "Edit Template"}
            </h4>

            <div className="space-y-4">
              <div className="space-y-2 mt-4">
                <Label htmlFor="templateName relative">
                  <span className="relative w-fit">Template Name</span>
                  <span className="text-red-600 absolute left-1/4">*</span>
                </Label>
                <Input
                  id="templateName" // Ensure to match the id with the Label's htmlFor
                  onChange={(e) => {
                    console.log(e.target.value);
                    setValue((prev) => ({
                      ...prev,
                      name: e.target.value, // Update only the `name` property
                    }));
                  }}
                  defaultValue={value?.name || ""}
                  placeholder="Enter Template Name"
                  className="bg-white min-h-11.5 border border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label>Note</Label>
                <Editor
                  value={templateContent}
                  setValue={setTemplateContent}
                  title=""
                />
              </div>

              <div className="flex justify-end mt-4">
                {templateState === "create_new_template" ? (
                  <Button
                    variant={"ctrl"}
                    className="bg-black text-xs min-w-25"
                    onClick={addNewTemplate}
                    disabled={
                      isCreateNewTemplateLoader ||
                      !value?.name ||
                      !templateContent
                    }
                  >
                    Create
                  </Button>
                ) : (
                  <Button
                    variant={"ctrl"}
                    onClick={editTemplate}
                    disabled={
                      isUpdateTemplateLoader || !value?.name || !templateContent
                    }
                    className="bg-black text-xs min-w-25"
                  >
                    Update
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end my-4 border-t pt-4 gap-2.5">
            <Button
              variant={"outline"}
              onClick={() => closeAction(false)}
              className="min-w-33 py-2.5 h-13 rounded-[50px] bg-white cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant={"ctrl"}
              className="min-w-33 py-2.5 h-13 rounded-[50px] cursor-pointer"
              onClick={createNote}
              disabled={isAddNotesLoader || !relatedEntity || !templateContent}
            >
              Save Note{" "}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
