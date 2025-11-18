import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";

// Backend proxy URL (defaults to local Express server on port 6000)
const GEMINI_PROXY_URL =
  import.meta.env?.VITE_GEMINI_PROXY_URL || "http://localhost:5050/analyze";

const ComplaintForm = () => {
  const [textValue, setTextValue] = useState("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  // const [videoFiles, setVideoFiles] = useState<FileList | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [warning, setWarning] = useState("");
  const [scores, setScores] = useState<{
    text_score: number;
    image_score: number;
    video_score: number;
    finalScore: number;
    isAnomalous: boolean;
    reasons: string[];
  } | null>(null);
  const ANOMALY_THRESHOLD = 0.7;

  // Read text from uploaded .txt file
  const handleTextFileUpload = (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setTextValue(text); // put txt file content into textarea
    };
    reader.readAsText(file);
  };

  // Compress image to a manageable base64 string
  const compressImageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Unable to compress image."));
            return;
          }

          const maxSize = 800;
          let { width, height } = img;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const mime = file.type || "image/jpeg";
          const dataUrl = canvas.toDataURL(mime, 0.7);
          const base64 = dataUrl.split(",")[1] || "";
          resolve(base64);
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const serializeImages = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return [];

    const serialized = await Promise.all(
      Array.from(fileList).map(async (file) => ({
        mime: file.type || "image/jpeg",
        base64: await compressImageToBase64(file),
      }))
    );

    return serialized;
  };

  // Gemini call handler (via backend proxy)
  const handleProcess = async () => {
    const trimmedText = textValue.trim();
    const hasImages = imageFiles && imageFiles.length > 0;

    if (!trimmedText && !hasImages) {
      setWarning(
        "Please add complaint text or upload at least one image before processing."
      );
      return;
    }

    setWarning("");
    setIsProcessing(true);

    try {
      const preparedImages = await serializeImages(imageFiles);

      const response = await fetch(GEMINI_PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedText,
          images: preparedImages,
          // videos: preparedVideos,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gemini request failed (${response.status}): ${errorText || "Unknown error"}`
        );
      }

      const json = await response.json();
      console.log(json);

      // Extract raw values (could be number or null)
      const rawText = json.text_score;
      const rawImage = json.image_score;
      const rawVideo = json.video_score;

      // Convert null → 0 (for display and thresholding)
      const text_score = rawText !== null ? Number(rawText) : 0;
      const image_score = rawImage !== null ? Number(rawImage) : 0;
      const video_score = rawVideo !== null ? Number(rawVideo) : 0;

      // Thresholds
      const TEXT_THRESHOLD = 0.60;
      const IMAGE_THRESHOLD = 0.50;
      const VIDEO_THRESHOLD = 0.70;

      // Determine anomaly + why it happened
      let isAnomalous = false;
      const reasons = [];

      // Check text anomaly
      if (text_score > TEXT_THRESHOLD) {
        isAnomalous = true;
        reasons.push("Text content appears anomalous or suspicious.");
      }

      // Check image anomaly
      if (image_score > IMAGE_THRESHOLD) {
        isAnomalous = true;
        reasons.push("Image evidence appears manipulated, edited, or irrelevant.");
      }

      // Check video anomaly
      if (video_score > VIDEO_THRESHOLD) {
        isAnomalous = true;
        reasons.push("Video evidence appears manipulated or deepfake-like.");
      }

      // Highest score for display
      const finalScore = Math.max(text_score, image_score, video_score);

      // Update state
      setScores({
        text_score,
        image_score,
        video_score,
        finalScore,
        isAnomalous,
        reasons,     // <--- NEW
      });
    } catch (error) {
      console.error(error);
      setWarning("Something went wrong while contacting Gemini. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-police-navy">
          Upload Complaint Files
        </h1>

        <div className="bg-white shadow-md p-6 rounded-lg">
          {warning && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {warning}
            </div>
          )}

          {/* Horizontal layout wrapper */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* TEXT SECTION */}
            <div className="flex-1 space-y-3">
              <label className="font-semibold">Enter or Upload Text</label>

              {/* Textarea */}
              <Textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Type complaint text here..."
                className="min-h-[150px]"
              />

              {/* File Input for .txt */}
              <Input
                type="file"
                accept=".txt"
                onChange={(e) => handleTextFileUpload(e.target.files?.[0] || null)}
              />
            </div>

            {/* IMAGE SECTION */}
            <div className="flex-1 space-y-3">
              <label className="font-semibold">Upload Images</label>

              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImageFiles(e.target.files)}
              />
            </div>

            {/* VIDEO SECTION (temporarily disabled) */}
            {/* <div className="flex-1 space-y-3">
              <label className="font-semibold">Upload Videos</label>

              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => setVideoFiles(e.target.files)}
              />
            </div> */}

          </div>

          {/* PROCESS BUTTON */}
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full mt-6 bg-police-green text-white hover:bg-police-green/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isProcessing ? "Processing..." : "Process"}
          </Button>

          {/* RESULTS */}
          {scores && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-police-navy shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Results</h2>
              <div className="space-y-2">
                <p>Text anomaly score: {scores.text_score.toFixed(2)}</p>
                <p>Image anomaly score: {scores.image_score.toFixed(2)}</p>
                <p>Video anomaly score: {scores.video_score.toFixed(2)}</p>
                {/* <p className="font-semibold">
                  Final weighted score: {scores.finalScore.toFixed(2)}
                </p> */}
                <p
                  className={`mt-4 font-semibold ${scores.isAnomalous ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {scores.isAnomalous
                    ? "Complaint is anomalous. Please investigate."
                    : "Complaint is valid."}
                </p>

                {/* WHY Section */}
                {scores.isAnomalous && scores.reasons && scores.reasons.length > 0 && (
                  <ul className="mt-2 list-disc ml-6 text-red-700 text-sm">
                    {scores.reasons.map((reason, i) => (
                      <li key={i}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ComplaintForm;