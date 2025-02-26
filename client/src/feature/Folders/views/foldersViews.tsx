import { useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { PiFolderSimple } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { deleteFileAsync, downloadFileAsync } from "../../../Redux/fileThunk";
import { shareFile } from "../../../Redux/fileshareThunk";
import { deleteFolderAsync, getFoldersAsync } from "../../../Redux/folderThunk";
import { AppDispatch, RootState } from "../../../Redux/store";

import toast from "react-hot-toast";
import { AiOutlineDownload } from "react-icons/ai";
import {
  MdOutlineDeleteOutline,
  MdOutlineFileCopy,
  MdOutlineDriveFileRenameOutline,
} from "react-icons/md";
import Breadcrumb from "../../../common/BreadCrumb";
import Button from "../../../common/Button";
import { useFolder } from "../../../context/FolderContext";
import ChooseDestinationModal from "./component/ChooseDestinationModal";
import RenameModal from "./component/RenameModal";
import SetPasswordModal from "./component/SetPasswordModal";
import ShareDropDown from "./component/ShareDropDown";

export const FoldersViews = ({ showActions }: { showActions: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Select Redux State
  const folders = useSelector((state: RootState) => state.folders.folders);
  const files = useSelector((state: RootState) => state.folders.files);
  const { downloadFileLoading } = useSelector((state: RootState) => state.file);
  const [showChooseDestinationModal, setShowChooseDestinationModal] =
    useState<boolean>(false);
  const [standardPath, setStandardPath] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [fileNameforRename, setFileNameforRename] = useState("");
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const { setFolderPath } = useFolder();
  // Function to copy link to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  // 🔹 Handlers
  const handleFolderClick = (name: string, path: string) => {
    console.log("path", path);
    const subpath = path.replace(/^\//, "");

    setFolderPath(subpath);
    dispatch(getFoldersAsync({ name, subFolderPath: subpath }));
  };

  const handleDelete = (name: string) => dispatch(deleteFolderAsync(name));

  const handleDownload = (filePath?: string) => {
    console.log("filePath from downloads", filePath);

    if (filePath) {
      console.log("loadingFile download", downloadFileLoading);
      dispatch(downloadFileAsync(filePath));
      console.log("loadingFile2 download", downloadFileLoading);
    }
  };

  const handleShare = (filePath?: string, fileName?: string) => {
    if (filePath && fileName) {
      dispatch(shareFile(filePath));
    }
  };

  const handleDeleteFile = (filePath: string) => {
    dispatch(deleteFileAsync(filePath));
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* 🔹 Breadcrumb Navigation */}
      <div className="flex space-x-2 text-sm text-gray-600 mb-4">
        <Breadcrumb />
      </div>

      {/* 🔹 Render Folders */}
      {folders.map((folder: any) => (
        <div
          key={folder.name}
          className="bg-gray-200/70 p-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer flex items-center justify-between">
          <div
            className="flex items-center gap-2"
            onClick={() => handleFolderClick(folder.name, folder.path)}>
            <div className="bg-sky-800/10 p-2 rounded-xl">
              <PiFolderSimple className="text-2xl" />
            </div>
            <h1 className="text-lg font-medium">{folder.name}</h1>
          </div>
          {showActions && (
            <Button
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => handleDelete(folder.name)}>
              <MdOutlineDeleteOutline />
            </Button>
          )}
        </div>
      ))}

      {/* 🔹 Render Files */}
      {files.map((file, index) => (
        <div
          key={file.name}
          className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex items-center justify-between relative group">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-500 group-hover:bg-blue-100 transition-colors">
              <FaRegFileAlt className="text-lg" />
            </div>
            <div>
              <h1 className="text-gray-800 font-medium">{file.name}</h1>
            </div>
          </div>
          {showActions && (
            <div key={file.path} className="flex items-center">
              {/* Action buttons with improved styling */}
              <div className="flex bg-gray-50 p-1 rounded-lg mr-1 shadow-sm border border-gray-100">
                {/* Download Button */}
                <Button
                  onClick={() => handleDownload(file.path)}
                  className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-blue-500 hover:text-white transition-colors">
                  <AiOutlineDownload className="text-lg" />
                </Button>

                {/* Copy Button */}
                <Button
                  className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-green-500 hover:text-white transition-colors"
                  onClick={() => {
                    setShowChooseDestinationModal(true);
                    setStandardPath(file.path || "");
                  }}>
                  <MdOutlineFileCopy className="text-lg" />
                </Button>

                {/* Rename Button */}
                <Button
                  className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-amber-500 hover:text-white transition-colors"
                  onClick={() => {
                    setShowRenameModal(true);
                    setStandardPath(file.path || "");
                    setFileNameforRename(file.name || "");
                  }}>
                  <MdOutlineDriveFileRenameOutline className="text-lg" />
                </Button>

                {/* Delete Button */}
                <Button
                  onClick={() => handleDeleteFile(file.path || "")}
                  className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-red-500 hover:text-white transition-colors">
                  <MdOutlineDeleteOutline className="text-lg" />
                </Button>
              </div>

              {/* Share Button with Dropdown */}
              <div className="relative">
                <ShareDropDown
                  file={{ name: file.name || "", path: file.path || "" }}
                  index={index}
                  handleShare={handleShare}
                  copyToClipboard={copyToClipboard}
                  setStandardPath={setStandardPath}
                  setShowSetPasswordModal={setShowSetPasswordModal}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <ChooseDestinationModal
        open={showChooseDestinationModal}
        setOpen={setShowChooseDestinationModal}
        standardPath={standardPath}
      />
      <RenameModal
        isOpen={showRenameModal}
        setIsOpen={setShowRenameModal}
        path={standardPath}
        fileName={fileNameforRename}
      />
      <SetPasswordModal
        filePath={standardPath}
        open={showSetPasswordModal}
        setOpen={setShowSetPasswordModal}
      />
    </div>
  );
};
