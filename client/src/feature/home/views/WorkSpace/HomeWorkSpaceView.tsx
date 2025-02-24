import { RootState, AppDispatch } from "../../../../Redux/store";
import { useEffect, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { TbCircleDashedPlus } from "react-icons/tb";
import { CreateModal } from "../../../../common";
import { useSelector, useDispatch } from "react-redux";
import {
  createFolderAsync,
  getFoldersAsync,
} from "../../../../Redux/folderThunk";
import { useNavigate } from "react-router-dom";

export const HomeWorkSpaceView = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const folders = useSelector((state: RootState) => state.folders.folders);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFoldersAsync({}));
  }, []);

  const handleCreateFolder = (folderName: string) => {
    if (folderName.trim()) {
      dispatch(createFolderAsync(folderName))
        .then(() => {
          setModalOpen(false);
        })
        .catch((error) => {
          console.error("Error creating folder:", error);
        });
    }
  };

  // Function to handle folder click
  const handleFolderClick = () => {
    navigate(`/folder`);
  };

  return (
    <div>
      <div className="absolute top-60 right-0 bg-white w-full flex items-start justify-center h-screen">
        <div className="grid grid-cols-4 gap-6 mt-6 w-6/12 bg-gray-100 p-4 rounded-lg shadow-md">
          {/* Display folders */}
          {folders.map((folder: any, index: number) => (
            <div
              key={index}
              onClick={() => handleFolderClick()}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg flex flex-col cursor-pointer">
              <div className="flex items-center justify-center p-6 h-[160px] bg-sky-800/10">
                <FaFolder className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold pt-2">{folder.name}</h3>
            </div>
          ))}

          {/* Create Folder Button */}
          <div
            onClick={() => setModalOpen(!isModalOpen)}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg flex flex-col items-center justify-center h-auto cursor-pointer">
            <TbCircleDashedPlus className="text-6xl text-grey-100/20" />
          </div>
        </div>
      </div>

      {/* Create Folder Modal */}
      <CreateModal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(!isModalOpen)}
        onConfirm={handleCreateFolder}
        modalType="folder"
      />
    </div>
  );
};
