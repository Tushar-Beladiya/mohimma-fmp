import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useFolder } from "../context/FolderContext";
import { getFoldersAsync } from "../Redux/folderThunk";
import { AppDispatch } from "../Redux/store";

const Breadcrumb: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { folderPath, setFolderPath, setUsersData, usersData } = useFolder();
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
  }, [folderPath, setFolderPath]);

  const handleClick = (index: number) => {
    const subFolderPath = parts.slice(0, index + 1).join("/");
    setFolderPath(subFolderPath);
  };

  return (
    <nav aria-label="breadcrumb" className="w-full">
      <div className="flex items-center justify-between">
        <ul className="flex space-x-2 text-blue-600 font-medium">
          <li
            className="inline cursor-pointer"
            onClick={() => {
              setFolderPath("");
              setUsersData(false);
            }}>
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
      </div>
    </nav>
  );
};

export default Breadcrumb;
