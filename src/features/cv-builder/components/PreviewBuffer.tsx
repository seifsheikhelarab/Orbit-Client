import { useState, useEffect, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Loader2 } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PreviewBufferProps {
    document: any;
    docType: "RESUME" | "COVER_LETTER";
    resumeData: any;
    coverLetterData: any;
    settings: any;
    syncDelay?: number;
}

export function PreviewBuffer({
    document,
    docType,
    resumeData,
    coverLetterData,
    settings
}: PreviewBufferProps) {
    const [urls, setUrls] = useState<[string | null, string | null]>([null, null]);
    const [activeSlot, setActiveSlot] = useState(0);
    const [isRendering, setIsRendering] = useState(false);
    
    const urlsRef = useRef<[string | null, string | null]>([null, null]);
    const activeSlotRef = useRef(0);
    const renderCountRef = useRef(0);
    const pendingUrlRef = useRef<{ url: string; slot: number } | null>(null);

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: () => [],
        renderToolbar: () => <></>,
    });

    useEffect(() => {
        if (!document) return;

        let isCancelled = false;
        const currentRenderId = ++renderCountRef.current;
        setIsRendering(true);

        const generatePreview = async () => {
            try {
                const { ResumePDF } = await import("../components/ResumePDF");
                const { CoverLetterTemplate } = await import("../components/templates/CoverLetterTemplate");
                
                const element = docType === "COVER_LETTER" 
                    ? <CoverLetterTemplate content={coverLetterData} />
                    : <ResumePDF data={{ ...resumeData, settings: settings }} />;

                const blob = await pdf(element).toBlob();
                const newUrl = URL.createObjectURL(blob);

                if (isCancelled || renderCountRef.current !== currentRenderId) {
                    URL.revokeObjectURL(newUrl);
                    return;
                }

                if (!urlsRef.current[0] && !urlsRef.current[1]) {
                    urlsRef.current = [newUrl, null];
                    activeSlotRef.current = 0;
                    setUrls([newUrl, null]);
                    setActiveSlot(0);
                    setIsRendering(false);
                    return;
                }

                const nextSlot = activeSlotRef.current === 0 ? 1 : 0;
                const newUrls: [string | null, string | null] = [...urlsRef.current];
                newUrls[nextSlot] = newUrl;
                urlsRef.current = newUrls;
                pendingUrlRef.current = { url: newUrl, slot: nextSlot };
                setUrls(newUrls);
                
            } catch (error) {
                console.error("Preview generation failed:", error);
            } finally {
                if (!isCancelled && renderCountRef.current === currentRenderId) {
                    setIsRendering(false);
                }
            }
        };

        generatePreview();

        return () => {
            isCancelled = true;
        };
    }, [document, docType, resumeData, coverLetterData, settings]);

    const handleDocumentLoad = (slot: number, url: string) => {
        const pending = pendingUrlRef.current;
        if (pending && pending.slot === slot && pending.url === url) {
            const previousSlot = activeSlotRef.current;
            const previousUrl = urlsRef.current[previousSlot];
            
            // SWAP!
            activeSlotRef.current = slot;
            setActiveSlot(slot);
            pendingUrlRef.current = null;

            if (previousUrl) {
                setTimeout(() => {
                    if (urlsRef.current[previousSlot] === previousUrl) {
                        URL.revokeObjectURL(previousUrl);
                        const cleanUrls: [string | null, string | null] = [...urlsRef.current];
                        cleanUrls[previousSlot] = null;
                        urlsRef.current = cleanUrls;
                        setUrls(cleanUrls);
                    }
                }, 1500); // Very generous delay to ensure full swap
            }
        }
    };

    useEffect(() => {
        return () => {
            urlsRef.current.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, []);

    if (!urls[0] && !urls[1]) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-sm bg-surface text-sm text-on-surface-variant shadow-xl">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing preview...
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-surface rounded-sm shadow-xl overflow-hidden">
            {isRendering && (
                <div className="absolute right-4 top-4 z-50 rounded-full bg-primary px-3 py-1 text-xs font-medium text-on-primary shadow-lg animate-pulse">
                    Rendering...
                </div>
            )}
            
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@5.7.284/build/pdf.worker.min.mjs`}>
                <div className="relative w-full h-full">
                    {urls.map((url, index) => (
                        url && (
                            <div 
                                key={`${index}-${url}`}
                                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                    index === activeSlot ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                                }`}
                            >
                                <Viewer
                                    fileUrl={url}
                                    plugins={[defaultLayoutPluginInstance]}
                                    theme="light"
                                    onDocumentLoad={() => handleDocumentLoad(index, url)}
                                />
                            </div>
                        )
                    ))}
                </div>
            </Worker>
            <style>{`
                .rpv-core__viewer {
                    background-color: white !important;
                }
                .rpv-core__inner-pages {
                    background-color: white !important;
                }
            `}</style>
        </div>
    );
}
