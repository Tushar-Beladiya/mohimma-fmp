import { IoCloseSharp } from "react-icons/io5";
import { FiFolder, FiCopy } from "react-icons/fi";
import { FoldersViews } from "../foldersViews";
import { useFolder } from "../../../../context/FolderContext";
import { AppDispatch } from "../../../../Redux/store";
import { useDispatch } from "react-redux";
import { copyFileAsync } from "../../../../Redux/fileThunk";
import { useState } from "react";

interface ChooseDestinationModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  standardPath: string;
}

const ChooseDestinationModal: React.FC<ChooseDestinationModalProps> = ({
  open,
  setOpen,
  standardPath,
}) => {
  const { folderPath } = useFolder();
  const dispatch = useDispatch<AppDispatch>();
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

  if (!open) return null;

  const handleCopyFile = () => {
    if (standardPath && folderPath) {
      console.log("COPYING FILE", standardPath, folderPath);
      dispatch(copyFileAsync(standardPath, folderPath));
    }
    setOpen(false);
  };

  // This is a wrapper component that would be used inside FoldersViews
  // You'll need to modify FoldersViews to accept this as a prop or extend its functionality
  const FolderItemWithCopyButton = ({
    folder,
    isActive,
  }: {
    folder: string;
    isActive: boolean;
  }) => {
    return (
      <div
        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        onMouseEnter={() => setHoveredFolder(folder)}
        onMouseLeave={() => setHoveredFolder(null)}>
        <div className="flex items-center space-x-3">
          <FiFolder
            className={`${isActive ? "text-blue-500" : "text-gray-400"}`}
            size={20}
          />
          <span
            className={`${
              isActive ? "font-medium text-blue-700" : "text-gray-700"
            }`}>
            {folder.split("/").pop()}
          </span>
        </div>

        {(isActive || hoveredFolder === folder) && (
          <button
            onClick={() => handleCopyFile()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center space-x-1 transition-all shadow-sm">
            <FiCopy size={14} />
            <span>Copy Here</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm z-50 transition-opacity"
      onClick={() => setOpen(false)}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative animate-fadeIn overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 rounded-t-xl flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiFolder className="text-blue-600" size={22} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              Choose Destination
            </h1>
          </div>

          <button
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close modal">
            <IoCloseSharp size={22} />
          </button>
        </div>

        {/* Instructions */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-gray-600 text-sm">
            Select a destination folder and click "Copy Here" to copy your file
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-grow">
          {/* 
            Note: You'll need to modify your FoldersViews component to accept a 
            renderItem prop or similar to use the FolderItemWithCopyButton component.
            For now, this is a placeholder that shows the intended UI.
          */}
          <div className="space-y-1 rounded-lg overflow-hidden">
            {/* This is just an example of what the items should look like */}
            <FolderItemWithCopyButton
              folder="/Documents"
              isActive={folderPath === "/Documents"}
            />

            {/* Your actual FoldersViews component should go here */}
            <FoldersViews
              showActions={false}
              // You would need to modify FoldersViews to accept something like:
              // renderItem={(folder, isActive) => (
              //   <FolderItemWithCopyButton folder={folder} isActive={isActive} />
              // )}
            />
          </div>
        </div>

        {/* Footer with current path display */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 text-sm text-gray-500">
          Current path:{" "}
          <span className="font-mono text-blue-600">{folderPath || "/"}</span>
        </div>
      </div>
    </div>
  );
};

export default ChooseDestinationModal;
