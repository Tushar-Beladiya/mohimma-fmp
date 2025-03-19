import { useState, useEffect } from "react";
import { CommonModal } from "../../../../common/components/Modal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Redux/store";
import { renameFileAsync } from "../../../../Redux/fileThunk";
import { renameFolderAsync } from "../../../../Redux/folderThunk";

interface RenameModalProps {
  renameModalData: {
    isOpen: boolean;
    isRenameFile: boolean;
    name: string;
  };
  setRenameModalData: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      isRenameFile: boolean;
      name: string;
    }>
  >;
  path: string;
}

const RenameModal: React.FC<RenameModalProps> = ({
  renameModalData,
  setRenameModalData,
  path,
}) => {
  const { isOpen, isRenameFile, name } = renameModalData;
  const [fileNameForInput, setFileNameForInput] = useState(name);
  const [loading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isOpen) {
      const newFileName = name.replace(/\..*$/, "");
      setFileNameForInput(newFileName);
      setError("");
    }
  }, [isOpen, name]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (/\./.test(newValue)) {
      setError("File name cannot contain '.' or extensions.");
    } else {
      setError("");
      setFileNameForInput(newValue);
    }
  };

  const handleRename = async () => {
    if (!fileNameForInput.trim() || fileNameForInput === name || error) return;
    try {
      if (isRenameFile) {
        await dispatch(renameFileAsync(path, fileNameForInput));
        setRenameModalData({ isOpen: false, isRenameFile: false, name: "" });
        setFileNameForInput("");
      } else {
        await dispatch(renameFolderAsync(path, fileNameForInput));
        setRenameModalData({ isOpen: false, isRenameFile: false, name: "" });
        setFileNameForInput("");
      }
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };

  return (
    <CommonModal
      title={isRenameFile ? "Rename File" : "Rename Folder"}
      open={isOpen}
      onClose={() =>
        setRenameModalData({ isOpen: false, isRenameFile: false, name: "" })
      }
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
