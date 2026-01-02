import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useGetPatientDetailsQuery } from "@/redux/services/patientApi";

import { useDebounce } from "@/hooks/use-debounce";
// import type { Address } from "@/types/global/commonTypes";
import { useViewAllPatientsQuery } from "@/redux/services/patient";
import type { Patient } from "@/types/responses/patient";
import { useAppDispatch } from "@/redux/store";
import { updatePatientDetails } from "@/redux/slices/subscription";

interface PatientSearchProps {
  selectedPatient?: string | null;
  onSelect: (id: Patient | null) => void;
  disabled?: boolean;
}

export function PatientSearch({
  selectedPatient,
  onSelect,
  disabled = false,
}: PatientSearchProps) {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [displayValue, setDisplayValue] = useState("");

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (selectedPatient) {
      const [firstName, lastName, phone, email, _id] =
        selectedPatient.split("/");
      setDisplayValue(`${firstName} ${lastName}, ${phone}, ${email}`);
      setSearch(""); // clear query so API doesn’t run
    } else {
      setDisplayValue("");
      setSearch("");
    }
  }, [selectedPatient]);

  const { data, isFetching } = useViewAllPatientsQuery(
    {
      page: 1,
      limit: 100,
      firstName: debouncedSearch,
      //   q: debouncedSearch,
    },
    {
      skip: debouncedSearch.trim().length === 0,
      selectFromResult: ({ data, isFetching }) => {
        return {
          data: data?.result,
          isFetching: isFetching,
        };
      },
    }
  );

  const handleClearSearch = () => {
    onSelect(null);
    setDisplayValue("");
    setSearch("");
    dispatch(updatePatientDetails({}));
  };

  return (
    <div className="space-y-2 ">
      <div className="relative">
        <Input
          id="patient"
          name="patient"
          className="border border-card-border min-w-[500px] min-h-[46px]"
          type="text"
          placeholder="Search patient..."
          value={displayValue}
          onChange={(e) => {
            if (!selectedPatient) {
              setDisplayValue(e.target.value);
              setSearch(e.target.value); // only update query if no selection
            }
          }}
          readOnly={!!selectedPatient}
        />

        {search || selectedPatient ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={handleClearSearch}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        )}
      </div>

      {search && !selectedPatient && (
        <div className="p-1 border border-card-border rounded-[10px]  ">
          <ul className="divide-y  max-h-[300px] overflow-y-auto">
            {isFetching ? (
              <li className="p-2 text-gray-500">Loading...</li>
            ) : data?.length ? (
              data?.map((patient: Patient) => {
                return (
                  <li
                    key={patient.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-0 flex text-sm font-normal gap-0.5"
                    onClick={() => {
                      onSelect(patient);
                      setDisplayValue(
                        `${patient.firstName} ${patient.lastName}, ${patient.phone}, ${patient.email}`
                      );
                      // onSelect(
                      //   `${patient.firstName} ${patient.lastName}, ${patient.phoneNumber}, ${patient.email}`,
                      //   patient.id,
                      // //   patient.addresses
                      // );
                      // setDisplayValue(
                      //   `${patient.firstName} ${patient.lastName}, ${patient.phoneNumber}, ${patient.email}`
                      // );
                      setSearch(""); // clear search query so API doesn’t re-run
                    }}
                  >
                    <span className="font-medium text-black">
                      {patient.firstName}
                    </span>
                    <span className="font-medium text-black">
                      {" "}
                      {patient.lastName} ,
                    </span>
                    <span>{patient.phone} ,</span>
                    <span>{patient.email}</span>
                  </li>
                );
              })
            ) : (
              <li className="p-2 text-gray-500 text-sm">No patients found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
