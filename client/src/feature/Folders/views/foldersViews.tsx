import { saveAs } from "file-saver";
import JSZip, { file } from "jszip";
import { useState } from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { PiFolderSimple } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { deleteFileAsync, downloadFileAsync } from "../../../Redux/fileThunk";
import { shareFile } from "../../../Redux/fileshareThunk";
import {
  deleteFolderAsync,
  downloadFolderAsync,
  getFoldersAsync,
} from "../../../Redux/folderThunk";
import { AppDispatch, RootState } from "../../../Redux/store";
import toast from "react-hot-toast";
import Breadcrumb from "../../../common/BreadCrumb";
import { useFolder } from "../../../context/FolderContext";
import ChooseDestinationModal from "./component/ChooseDestinationModal";
import RenameModal from "./component/RenameModal";
import SetPasswordModal from "./component/SetPasswordModal";
import ShareDropDown from "./component/ShareDropDown";
import Actions from "./component/Actions";
import { shareFolder } from "../../../Redux/foldershareThunk";

export const FoldersViews = ({ showActions }: { showActions: boolean }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Select Redux State
  const folders = useSelector((state: RootState) => state.folders.folders);
  const files = useSelector((state: RootState) => state.folders.files);
  const [showChooseDestinationModal, setShowChooseDestinationModal] =
    useState<boolean>(false);
  const [standardPath, setStandardPath] = useState("");
  const [showRenameModal, setShowRenameModal] = useState({
    isOpen: false,
    name: "",
    isRenameFile: false,
  });
  const [passwordModalData, setPasswordModalData] = useState({
    isOpen: false,
    isPasswordModalForFile: false,
  });
  const { setFolderPath } = useFolder();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  // 🔹 Handlers
  const handleFolderClick = (name: string, path: string) => {
    const subpath = path.replace(/^\//, "");

    setFolderPath(subpath);
    dispatch(getFoldersAsync({ name, subFolderPath: subpath }));
  };

  const handleDelete = (name: string, subFolderPath?: string) => {
    dispatch(deleteFolderAsync(name, subFolderPath));
  };

  const handleDownload = (filePath?: string) => {
    if (filePath) {
      dispatch(downloadFileAsync(filePath));
    }
  };

  const handleDownloadFolder = async (folderPath: string) => {
    dispatch(downloadFolderAsync(folderPath));
  };
  const handleShare = (filePath?: string, fileName?: string) => {
    if (filePath && fileName) {
      dispatch(shareFile(filePath));
    }
  };
  const handleShareFolder = (folderPath?: string) => {
    if (folderPath) {
      dispatch(shareFolder(folderPath));
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
      {folders.map((folder: any, index) => (
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
            <div className="flex items-center">
              <Actions
                isFolder={true}
                downloadOnClick={() => {
                  handleDownloadFolder(folder.path);
                }}
                renameOnClick={() => {
                  setShowRenameModal({
                    isOpen: true,
                    name: folder.name,
                    isRenameFile: false,
                  });
                  setStandardPath(folder.path || "");
                }}
                deleteOnClick={() => handleDelete(folder.name, folder.path)}
              />
              {/* Share Button with Dropdown */}
              <div className="relative">
                <ShareDropDown
                  file={{
                    name: folder.name || "",
                    path: folder.path || "",
                    isFile: false,
                  }}
                  index={index}
                  handleShare={handleShareFolder}
                  copyToClipboard={copyToClipboard}
                  setStandardPath={setStandardPath}
                  setPasswordModalData={setPasswordModalData}
                />
              </div>
            </div>
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
              <Actions
                isFolder={false}
                downloadOnClick={() => {
                  handleDownload(file.path);
                }}
                copyOnClick={() => {
                  setShowChooseDestinationModal(true);
                  setStandardPath(file.path || "");
                }}
                renameOnClick={() => {
                  setShowRenameModal({
                    isOpen: true,
                    name: file.name || "",
                    isRenameFile: true,
                  });
                  setStandardPath(file.path || "");
                }}
                deleteOnClick={() => handleDeleteFile(file.path || "")}
              />

              {/* Share Button with Dropdown */}
              <div className="relative">
                <ShareDropDown
                  file={{
                    name: file.name || "",
                    path: file.path || "",
                    isFile: true,
                  }}
                  index={index}
                  handleShare={handleShare}
                  copyToClipboard={copyToClipboard}
                  setStandardPath={setStandardPath}
                  setPasswordModalData={setPasswordModalData}
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
        renameModalData={showRenameModal}
        setRenameModalData={setShowRenameModal}
        path={standardPath}
      />
      <SetPasswordModal
        filePath={standardPath}
        passwordModalData={passwordModalData}
        setPasswordModalData={setPasswordModalData}
      />
    </div>
  );
};
