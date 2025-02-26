import { useState, useEffect } from "react";
import { CommonModal } from "../../../../common/components/Modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Redux/store";
import { renameFileAsync } from "../../../../Redux/fileThunk";

interface RenameModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  path: string;
  fileName: string;
}

const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  setIsOpen,
  path,
  fileName,
}) => {
  const [fileNameForInput, setFileNameForInput] = useState(fileName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen) {
      //  remove after . value from the file name
      const newFileName = fileName.replace(/\..*$/, "");
      setFileNameForInput(newFileName);
      setError(""); // Reset error when reopening
    }
  }, [isOpen, fileName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Validate input: No dots (to prevent extensions)
    if (/\./.test(newValue)) {
      setError("File name cannot contain '.' or extensions.");
    } else {
      setError("");
      setFileNameForInput(newValue);
    }
  };

  const handleRename = async () => {
    if (!fileNameForInput.trim() || fileNameForInput === fileName || error)
      return;
    try {
      await dispatch(renameFileAsync(path, fileNameForInput));
      setIsOpen(false);
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  return (
    <CommonModal
      title="Rename File"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={handleRename}>
      <input
        type="text"
        value={fileNameForInput}
        onChange={handleInputChange}
        placeholder="Enter new name"
        className={`border w-full p-2 rounded-lg ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        disabled={loading}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </CommonModal>
  );
};

export default RenameModal;
