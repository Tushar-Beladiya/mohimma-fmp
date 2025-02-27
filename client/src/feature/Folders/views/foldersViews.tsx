import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaFileAlt,
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
  FaRegFileAlt,
} from "react-icons/fa";
import { PiFolderSimple } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

// Redux imports
import {
  deleteFileAsync,
  downloadFileAsync,
  FilePreviAsync,
} from "../../../Redux/fileThunk";
import { shareFile } from "../../../Redux/fileshareThunk";
import {
  deleteFolderAsync,
  downloadFolderAsync,
  getFoldersAsync,
} from "../../../Redux/folderThunk";
import { shareFolder } from "../../../Redux/foldershareThunk";
import { AppDispatch, RootState } from "../../../Redux/store";

// Component imports
import Breadcrumb from "../../../common/BreadCrumb";
import Actions from "./component/Actions";
import ChooseDestinationModal from "./component/ChooseDestinationModal";
import { FilePreview } from "./component/FilePreview";
import RenameModal from "./component/RenameModal";
import SetPasswordModal from "./component/SetPasswordModal";
import ShareDropDown from "./component/ShareDropDown";

// Utils
import { useFolder } from "../../../context/FolderContext";
import { getFileExtension } from "../../../utils/GetFileExtension";

// Types
interface FileData {
  name: string;
  path: string;
  type: string;
}

interface FolderData {
  name: string;
  path: string;
}

interface RenameModalState {
  isOpen: boolean;
  name: string;
  isRenameFile: boolean;
}

interface PasswordModalState {
  isOpen: boolean;
  isPasswordModalForFile: boolean;
}

interface FoldersViewsProps {
  showActions: boolean;
}

export const FoldersViews: React.FC<FoldersViewsProps> = ({ showActions }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const folders = useSelector(
    (state: RootState) => state.folders.folders
  ) as FolderData[];
  const files = useSelector(
    (state: RootState) => state.folders.files
  ) as FileData[];

  const { error } = useSelector((state: RootState) => state.file);

  // Local state
  const [showChooseDestinationModal, setShowChooseDestinationModal] =
    useState<boolean>(false);
  const [standardPath, setStandardPath] = useState<string>("");
  const [showRenameModal, setShowRenameModal] = useState<RenameModalState>({
    isOpen: false,
    name: "",
    isRenameFile: false,
  });
  const [passwordModalData, setPasswordModalData] =
    useState<PasswordModalState>({
      isOpen: false,
      isPasswordModalForFile: false,
    });
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setFolderPath } = useFolder();

  // Helper functions
  const copyToClipboard = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const getFileIcon = (filename: string): JSX.Element => {
    if (filename === "") return <FaRegFileAlt className="text-lg" />;

    const ext = getFileExtension(filename);

    if (["pdf"].includes(ext)) return <FaFilePdf className="text-lg" />;
    if (["mp4", "webm", "mov"].includes(ext))
      return <FaFileVideo className="text-lg" />;
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return <FaFileImage className="text-lg" />;
    if (["md", "txt"].includes(ext)) return <FaFileAlt className="text-lg" />;

    return <FaRegFileAlt className="text-lg" />;
  };

  // Event handlers
  const handleFolderClick = (name: string, path: string): void => {
    const subpath = path.replace(/^\//, "");

    setFolderPath(subpath);
    dispatch(getFoldersAsync({ name, subFolderPath: subpath }));
  };

  const handleDelete = (name: string, subFolderPath?: string): void => {
    dispatch(deleteFolderAsync(name, subFolderPath));
  };

  const handleDownload = (filePath?: string): void => {
    if (filePath) {
      dispatch(downloadFileAsync(filePath));
    }
  };

  const handleDownloadFolder = (folderPath: string): void => {
    dispatch(downloadFolderAsync(folderPath));
  };

  const handleShare = (filePath?: string, fileName?: string): void => {
    if (filePath && fileName) {
      dispatch(shareFile(filePath));
    }
  };

  const handleShareFolder = (folderPath?: string): void => {
    if (folderPath) {
      dispatch(shareFolder(folderPath));
    }
  };

  const handleDeleteFile = (filePath: string): void => {
    dispatch(deleteFileAsync(filePath));
  };

  const handleFileClick = async (file: FileData) => {
    setIsLoading(true);

    setPreviewFile(file);

    const response = await dispatch(FilePreviAsync(file.path));
    if (response?.success && response?.result) {
      const { data } = response.result; // Extract buffer data
      const uint8Array = new Uint8Array(data); // Convert to Uint8Array
      const ext = getFileExtension(file.name); // Get file extension
      const blob = new Blob([uint8Array], { type: `application/${ext}` }); // Create Blob
      const fileURL = URL.createObjectURL(blob); // Create URL
      setPreviewUrl(fileURL);
    } else {
      toast.error("Failed to preview file");
      closePreview();
    }

    setIsLoading(false);
  };

  const closePreview = (): void => {
    setPreviewFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Breadcrumb Navigation */}
      <div className="flex space-x-2 text-sm text-gray-600 mb-4">
        <Breadcrumb />
      </div>

      {/* Folders List */}
      {folders.map((folder: FolderData) => (
        <div
          key={folder.name}
          className="bg-gray-200/70 p-2 rounded-lg shadow-md hover:shadow-lg cursor-pointer flex items-center justify-between"
        >
          <div
            className="flex items-center gap-2"
            onClick={() => handleFolderClick(folder.name, folder.path)}
          >
            <div className="bg-sky-800/10 p-2 rounded-xl">
              <PiFolderSimple className="text-2xl" />
            </div>
            <h1 className="text-lg font-medium">{folder.name}</h1>
          </div>

          {showActions && (
            <div className="flex items-center">
              <Actions
                isFolder={true}
                downloadOnClick={() => handleDownloadFolder(folder.path)}
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
                    name: folder.name,
                    path: folder.path,
                    isFile: false,
                  }}
                  index={folders.indexOf(folder)}
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

      {/* Files List */}
      {files.map((file: FileData) => (
        <div
          key={file.name}
          className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 flex items-center justify-between relative group"
        >
          <div
            className="flex items-center gap-3"
            onClick={() => handleFileClick(file)}
          >
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-500 group-hover:bg-blue-100 transition-colors">
              {getFileIcon(file.name)}
            </div>
            <div>
              <h1 className="text-gray-800 font-medium">{file.name}</h1>
            </div>
          </div>

          {showActions && (
            <div className="flex items-center">
              <Actions
                isFolder={false}
                downloadOnClick={() => handleDownload(file.path)}
                copyOnClick={() => {
                  setShowChooseDestinationModal(true);
                  setStandardPath(file.path);
                }}
                renameOnClick={() => {
                  setShowRenameModal({
                    isOpen: true,
                    name: file.name,
                    isRenameFile: true,
                  });
                  setStandardPath(file.path);
                }}
                deleteOnClick={() => handleDeleteFile(file.path)}
              />

              {/* Share Button with Dropdown */}
              <div className="relative">
                <ShareDropDown
                  file={{
                    name: file.name,
                    path: file.path,
                    isFile: true,
                  }}
                  index={files.indexOf(file)}
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

      {/* Modals */}
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

      {/* File Preview */}
      <FilePreview
        previewFile={previewFile}
        closePreview={closePreview}
        isLoading={isLoading}
        error={error}
        previewUrl={previewUrl}
      />
    </div>
  );
};
