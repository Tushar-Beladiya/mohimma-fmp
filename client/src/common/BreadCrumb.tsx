import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFoldersAsync } from "../Redux/folderThunk";
import { AppDispatch, RootState } from "../Redux/store";
import { Link } from "react-router-dom";
import { useFolder } from "../context/FolderContext";

interface BreadcrumbProps {
  // folderPath: string;
  // setFolderPath: React.Dispatch<React.SetStateAction<string>>;
}

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { folderPath, setFolderPath } = useFolder();
  console.log("Breadcrumb folderPath:", folderPath);
  const { uploadFileLoading } = useSelector((state: RootState) => state.file);
  const parts = folderPath.split("/").filter(Boolean);

  useEffect(() => {
    const fetchData = async () => {
      if (!folderPath) return dispatch(getFoldersAsync({}));
      const parts = folderPath.split("/").filter(Boolean);
      const foldername = parts?.pop() || "";
      dispatch(
        getFoldersAsync({ name: foldername, subFolderPath: folderPath })
      );
    };
    fetchData();
  }, [folderPath, dispatch, uploadFileLoading, setFolderPath]);

  const handleClick = (index: number) => {
    const subFolderPath = parts.slice(0, index + 1).join("/");
    setFolderPath(subFolderPath);
  };

  return (
    <nav aria-label="breadcrumb">
      <ul className="flex space-x-2 text-blue-600 font-medium">
        <li className="inline cursor-pointer" onClick={() => setFolderPath("")}>
          <Link to="/folder" className="hover:underline">
            All Files
          </Link>
          {parts.length > 0 && <span> / </span>}
        </li>
        {parts.map((part, index) => (
          <li key={index} className="inline cursor-pointer">
            <span
              onClick={() => handleClick(index)}
              className="hover:underline text-blue-500">
              {part}
            </span>
            {index !== parts.length - 1 && <span> / </span>}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
