import { Button } from "@/components/ui/button";
import encounterApi from "@/redux/services/encounter";
import { useAppDispatch } from "@/redux/store";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

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
  const [openVisitIframe, setOpenVisitIframe] = useState(false);
  let token = localStorage.getItem("accessToken");

  // Remove starting and ending single quotes (if present)
  token = token ? token.replace(/^['"]|['"]$/g, "") : token;

  const clearLocalStorage = () => {
    const iframe = iframeRef.current;
    // console.log("Iframe reference:", iframe?.contentWindow);
    if (iframe && iframe.contentWindow) {
      // Only call postMessage if iframe.contentWindow is not null

      iframe.contentWindow.postMessage("clearLocalStorage", "*");

      // console.log("done");
    } else {
      console.error("Could not find iframe contentWindow.");
    }
  };

  const onCloseIframeModal = () => {
    clearLocalStorage();
    setTimeout(() => {
      setOpenVisitIframe(false);
      // console.log("GGGGGG");
      dispatch(encounterApi.endpoints.viewEncounterById.initiate(orderId));
    }, 50);
  };

  useEffect(() => {
    if (openVisitIframe) {
      clearLocalStorage();
      setTimeout(() => {
        dispatch(encounterApi.endpoints.viewEncounterById.initiate(orderId));
      }, 50);
    }
  }, [openVisitIframe]);

  return (
    <>
      <Button
        variant={"transparent"}
        onClick={() => setOpenVisitIframe(true)}
        className="min-w-31.75 text-sm font-semibold text-black border-black"
      >
        Perform Visit
      </Button>

      {openVisitIframe && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-10"
            style={{
              backdropFilter: "blur(8px)", // Apply background blur effect
            }}
          ></div>
          <div
            className="z-100 shadow-md p-2 absolute top-10 bg-white border "
            style={{
              boxShadow: "0px 2px 40px 0px #00000014",
              backdropFilter: "blur(10px)", // Apply blur to the background behind the modal
            }}
          >
            <div className="flex justify-end">
              <X onClick={onCloseIframeModal} />
            </div>
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
          </div>
        </>
      )}
    </>
  );
}
