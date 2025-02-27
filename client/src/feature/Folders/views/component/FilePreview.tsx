import { FaRegFileAlt } from "react-icons/fa";
import { CommonModal } from "../../../../common/components/Modal";
import { getFileExtension } from "../../../../utils/GetFileExtension";

export const FilePreview = ({
  previewFile,
  closePreview,
  isLoading,
  error,
  previewUrl,
}: {
  previewFile: any;
  closePreview: any;
  isLoading: any;
  error: any;
  previewUrl: any;
}) => {
  const renderPreview = () => {
    if (!previewFile) return null;

    const ext = getFileExtension(previewFile.name);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // PDF Preview
    if (ext === "pdf") {
      return (
        <iframe
          src={`${previewUrl}#view=FitH`}
          className="w-full h-full"
          title={previewFile.name}
        />
      );
    }

    // Video Preview
    if (["mp4", "webm", "mov"].includes(ext)) {
      return (
        <video controls className="max-w-full max-h-full">
          <source src={previewUrl} type={`video/${ext}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Image Preview
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={previewUrl}
            alt={previewFile.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    // Text/Markdown Preview (would need backend support to return text)
    if (["md", "txt"].includes(ext)) {
      return (
        <div className="bg-white p-4 rounded shadow-md overflow-auto h-full w-full">
          <pre className="whitespace-pre-wrap text-gray-800">
            {/* This would typically fetch text from the backend */}
          </pre>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FaRegFileAlt className="text-6xl text-gray-400 mb-4" />
        <div className="text-gray-600 mb-2">
          Preview not available for this file type.
        </div>
        <a
          href={previewUrl}
          download
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <>
      <CommonModal
        title={previewFile?.name || ""}
        open={previewFile}
        onClose={closePreview}
        width="w-1/2"
      >
        {renderPreview()}
      </CommonModal>
    </>
  );
};
