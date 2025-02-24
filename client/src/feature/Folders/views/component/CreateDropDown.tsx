import React, { useState } from "react";
import { useDispatch } from "react-redux";

import DropDown from "../../../../common/DropDown";
import { AppDispatch } from "../../../../Redux/store";
import { createFolderAsync } from "../../../../Redux/folderThunk";
import { uploadFileAsync } from "../../../../Redux/fileThunk";
import { CreateModal } from "../../../../common";
import { useFolder } from "../../../../context/FolderContext";

interface DropDownProps {
  dropdown: boolean;
  setDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  contextMenuPosition: { x: number; y: number } | null;
  // folderPath: string;
  // setFolderPath?: React.Dispatch<React.SetStateAction<string>>;
}

const CreateDropDown: React.FC<DropDownProps> = ({
  dropdown,
  setDropdown,
  contextMenuPosition,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { folderPath, setFolderPath } = useFolder();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setDropdown(false);
  };

  const handleCreateFolder = (folderName: string) => {
    if (!folderName.trim()) return;
    const fullPath = folderPath ? `${folderPath}/${folderName}` : folderName;
    dispatch(createFolderAsync(folderName, fullPath))
      .then(() => setModalOpen(false))
      .catch((error: string) => console.error("Error creating folder:", error));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const path = folderPath.startsWith("/")
        ? folderPath.slice(1)
        : folderPath;
      const file = e.target.files[0];
      dispatch(uploadFileAsync(file, path))
        .then(() => setDropdown(false))
        .catch((error: string) =>
          console.error("Error uploading file:", error)
        );
    }
  };

  return (
    <>
      <DropDown contextMenuPosition={contextMenuPosition} dropdown={dropdown}>
        <div className="py-1 rounded" role="none">
          <button
            className="block px-4 py-2 text-sm text-gray-700"
            onClick={() => {
              toggleModal();
              setModalType("folder");
            }}>
            Create Folder
          </button>
          <label
            className="block px-4 py-2 text-sm text-gray-700 cursor-pointer font-red"
            onClick={(e) => {
              e.stopPropagation();
            }}>
            Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                handleFileUpload(e);
                setDropdown(false);
              }}
              key={Math.random()}
            />
          </label>
        </div>
      </DropDown>

      {/* Create Folder Modal */}
      <CreateModal
        isOpen={isModalOpen}
        closeModal={toggleModal}
        modalType={modalType}
        onConfirm={handleCreateFolder}
      />
    </>
  );
};

export default CreateDropDown;
