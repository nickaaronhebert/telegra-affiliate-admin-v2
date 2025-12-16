import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload } from "./Upload";
import { ImageModal } from "./ImageModal";

// Define enums and types based on the old project
const DataTypes = {
  Input: "input",
  NumberInput: "number-input",
  Select: "select",
  Radio: "radio",
  CheckboxGroup: "checkbox-group",
  Agreement: "agreement",
  Signature: "signature",
  Table: "table",
  Upload: "upload",
} as const;

const LocationTypes = {
  Question: "question",
} as const;

const UniversalSelectModes = {
  Single: "single",
  Multiple: "multiple",
} as const;

interface IFile {
  url: string;
  name: string;
  format: string;
}

interface IQuestionnaireInstanceResponse {
  value: string | string[];
  data?: {
    agreementData?: {
      signature: string;
    };
    values?: any[];
  };
  files: IFile[];
  location: ILocation;
}

interface ILocation {
  locationType: (typeof LocationTypes)[keyof typeof LocationTypes];
  data: {
    type: (typeof DataTypes)[keyof typeof DataTypes];
    label?: string;
    description?: string;
    mode?: (typeof UniversalSelectModes)[keyof typeof UniversalSelectModes];
    props?: {
      options?: Array<{
        value: string;
        label: string;
      }>;
      columns?: Array<{
        label: string;
        value: string;
      }>;
    };
  };
}

interface ResponseProps {
  location?: ILocation;
  response?: IQuestionnaireInstanceResponse;
}

export const Response = ({ location, response }: ResponseProps) => {
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  const renderResponse = () => {
    if (location?.locationType === LocationTypes.Question) {
      switch (location?.data?.type) {
        case DataTypes.Input:
        case DataTypes.NumberInput:
          return <div className="text-sm text-gray-900">{response?.value}</div>;

        case DataTypes.Select:
        case DataTypes.Radio:
        case DataTypes.CheckboxGroup:
          if (
            location.data.mode === UniversalSelectModes.Single ||
            location.data.type === DataTypes.Radio
          ) {
            return (
              <RadioGroup value={response?.value as string} className="gap-3">
                {location.data.props?.options?.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      checked={response?.value === option.value}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            );
          } else if (
            location.data.mode === UniversalSelectModes.Multiple ||
            location.data.type === DataTypes.CheckboxGroup
          ) {
            const responseValues = response?.value as string[];
            return (
              <div className="space-y-3">
                {location.data.props?.options?.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.value}
                      checked={responseValues?.includes(option.value)}
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            );
          }
          break;

        case DataTypes.Agreement:
        case DataTypes.Signature:
          return (
            <div className="border rounded-lg p-4 bg-gray-50">
              {response?.data?.agreementData?.signature && (
                <img
                  src={response?.data?.agreementData?.signature}
                  alt="Signature"
                  className="max-w-full h-auto"
                />
              )}
            </div>
          );

        case DataTypes.Table:
          if (response?.data?.values) {
            const columns = location.data.props?.columns || [];
            const data = response?.data?.values;

            return (
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead key={index}>{column.label}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row: any, rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column, colIndex) => (
                        <TableCell key={colIndex}>
                          {row[column.value] || ""}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            );
          }
          break;

        case DataTypes.Upload:
          return (
            <div className="space-y-3">
              {response?.files?.map((file: IFile, index: number) => (
                <Upload
                  key={index}
                  file={file}
                  onClick={() => setSelectedFile(file)}
                />
              ))}
            </div>
          );

        default:
          return (
            <div className="text-sm text-gray-500">
              Unsupported response type: {location?.data?.type}
            </div>
          );
      }
    }

    return null;
  };

  return (
    <>
      <div className="mt-2">{renderResponse()}</div>
      {selectedFile && (
        <ImageModal
          file={selectedFile}
          onCancel={() => setSelectedFile(null)}
        />
      )}
    </>
  );
};
