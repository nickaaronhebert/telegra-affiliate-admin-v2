import { ConfirmDialog } from "@/components/common/Dialog";
import { Button } from "@/components/ui/button";
import encounterApi from "@/redux/services/encounter";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useRef, useState } from "react";

interface SendPerformVisitLinkProps {
  orderId: string;
  affiliateId: string;
}
export default function SendPerformVisitLink({
  orderId,
  affiliateId,
}: SendPerformVisitLinkProps) {
  const dispatch = useAppDispatch();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [openVisitDialog, setOpenVisitDialog] = useState(false);
  let token = localStorage.getItem("accessToken");

  // Remove starting and ending single quotes (if present)
  token = token ? token.replace(/^['"]|['"]$/g, "") : token;

  console.log("Token in Perform Visit Link:", token);

  const clearLocalStorage = () => {
    const iframe = iframeRef.current;
    console.log("Iframe reference:", iframe?.contentWindow);
    if (iframe && iframe.contentWindow) {
      // Only call postMessage if iframe.contentWindow is not null
      iframe.contentWindow.postMessage("clearLocalStorage", "*");
      console.log("done");
    } else {
      console.error("Could not find iframe contentWindow.");
    }
  };

  const onCloseIframeModal = () => {
    clearLocalStorage();
    setTimeout(() => {
      console.log("GGGGGG");
      dispatch(encounterApi.endpoints.viewEncounterById.initiate(orderId));
    }, 50);
  };

  useEffect(() => {
    if (!openVisitDialog) {
      console.log("aasdasdasd asdasdasd asdasdas");
      onCloseIframeModal();
    }
  }, [openVisitDialog]);
  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenVisitDialog(true)}
        className="min-w-31.75 text-sm font-semibold text-black border-black"
      >
        Perform Visit
      </Button>

      <ConfirmDialog
        title=""
        containerWidth="min-w-[1660px]"
        open={openVisitDialog}
        onOpenChange={setOpenVisitDialog}
        onConfirm={() => {}}
        showFooter={false}
      >
        <iframe
          ref={iframeRef}
          src={`${
            import.meta.env.VITE_PATIENT_FRONTEND_URL
          }/iframe/visit?id=${orderId}&iframe=true&affiliate=${affiliateId}&access_token=${token}`}
          sandbox="allow-same-origin allow-scripts allow-forms"
          title="description"
          width={1600}
          height={800}
        ></iframe>
      </ConfirmDialog>
    </>
  );
}
