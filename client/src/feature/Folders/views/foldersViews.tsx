import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../Redux/store";
import { deleteFolderAsync, getFoldersAsync } from "../../../Redux/folderThunk";
import { downloadFileAsync } from "../../../Redux/fileThunk";
import { shareFile } from "../../../Redux/fileshareThunk";
import { PiFolderSimple } from "react-icons/pi";
import { FaRegFileAlt } from "react-icons/fa";

import {
  AiOutlineDownload,
  AiOutlineLink,
  AiOutlineShareAlt,
} from "react-icons/ai";
import toast from "react-hot-toast";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Breadcrumb from "../../../common/BreadCrumb";
// import axios from "axios";
// import { createClient, FileStat } from "webdav";
// import { fetchDirectoryContents } from "../../../api/fileapi";
import Loader from "../../../common/Loader";
import DropDown from "../../../common/DropDown";
import { useFolder } from "../../../context/FolderContext";
import Button from "../../../common/Button";

interface SharedFile {
  name: string;
  url: string;
  isPublic?: boolean;
}

interface folderViewProps {
  // folderPath: string;
  // setFolderPath: React.Dispatch<React.SetStateAction<string>>;
}

export const FoldersViews: React.FC<folderViewProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  // useEffect(() => {
  //   const loadFiles = async () => {
  //     const contents = await fetchDirectoryContents();
  //     setContentFiles(contents);
  //     setContentLoading(false);
  //   };

  //   loadFiles();
  // }, []);

  // const [imageUrl, setImageUrl] = useState("");

  // // Nextcloud WebDAV settings (replace with your actual Nextcloud server settings)
  // const client = createClient("http://localhost:8080/remote.php/webdav", {
  //   username: "admin",
  //   password: "123456789",
  // });

  // const nextcloudFilePath = "/Photos/customer.png";

  // useEffect(() => {
  //   const fetchImage = async () => {
  //     try {
  //       // Fetch the image file from WebDAV
  //       const fileContents = await client.getFileContents(nextcloudFilePath);
  //       // Convert the file contents to a Blob
  //       const blob = new Blob([new Uint8Array(fileContents as ArrayBuffer)], {
  //         type: "image/png",
  //       });

  //       // Create a URL for the Blob and set it for the image preview
  //       const imageUrl = URL.createObjectURL(blob);
  //       setImageUrl(imageUrl);
  //       console.log("imageUrl====", imageUrl);
  //     } catch (error) {
  //       console.error("Error fetching image from WebDAV:", error);
  //     }
  //   };

  //   fetchImage();
  // }, []);

  // Select Redux State
  const folders = useSelector((state: RootState) => state.folders.folders);
  const files = useSelector((state: RootState) => state.folders.files);
  const { uploadFileLoading, downloadFileLoading, fileUploadPath } =
    useSelector((state: RootState) => state.file);
  const { shareUrl } = useSelector((state: RootState) => state.fileShare);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const { folderPath, setFolderPath } = useFolder();
  // Function to copy link to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  // useEffect(() => {
  //   dispatch(getFoldersAsync({}));
  //   setFolderPath("");
  //   return;
  // }, [dispatch]);

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

  //  file visibility
  // async function getFileContent(filePath: string) {
  //   const response = await axios({
  //     method: "GET",
  //     url: "http://localhost:8080/remote.php/dav/files/admin" + filePath,
  //     auth: {
  //       username: "admin",
  //       password: "123456789",
  //     },
  //     responseType: "blob",
  //   });
  //   return response.data;
  // }

  // const handleFileVisibility = async (filePath: string) => {
  //   const response = await getFileContent(filePath);
  //   console.log("response of get files visibility", response);
  // };

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
          <Button
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => handleDelete(folder.name)}>
            <MdOutlineDeleteOutline />
          </Button>
        </div>
      ))}

      {/* 🔹 Render Files */}
      {files.map((file, index) => (
        <div
          key={file.name}
          className="bg-gray-100 p-2 rounded-lg shadow-md flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 p-2 rounded-xl">
              <FaRegFileAlt className="text-md" />
            </div>
            <h1 className="text-md font-small">{file.name}</h1>
          </div>

          <div key={file.path} className="flex gap-3 items-center">
            {/* Download Button */}
            <Button
              onClick={() => handleDownload(file.path)}
              className="bg-blue-500 text-white hover:bg-blue-600">
              <AiOutlineDownload className="text-lg" />
            </Button>

            {/* Share Button with Dropdown */}
            <div className="relative">
              <Button
                onClick={() => {
                  setOpenDropdown(openDropdown === index ? null : index);
                  handleShare(file.path, file.name);
                }}
                className="bg-green-500 text-white hover:bg-green-600">
                <AiOutlineShareAlt className="text-lg" />
              </Button>
              <DropDown
                dropdown={openDropdown === index}
                contextMenuPosition={{ x: -100, y: 30 }}>
                <Button
                  onClick={() => {
                    copyToClipboard(shareUrl as string);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  <AiOutlineLink />
                  Copy Link
                </Button>
              </DropDown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
