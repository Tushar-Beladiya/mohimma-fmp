import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSharedDataAsync,
  inviteUserAsync,
} from "../../../../../Redux/thunk";
import { AppDispatch, RootState } from "../../../../../Redux/store";
interface ShareWithModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fileName: string;
  path: string;
}
export const ShareWithModal: React.FC<ShareWithModalProps> = ({
  open,
  setOpen,
  fileName,
  path,
}) => {
  const [accessLevel, setAccessLevel] = useState("Restricted");
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  const { sharedFolders } = useSelector((state: RootState) => state.inviteUser);
  const [username, setUserName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const handleShareWithUser = (value: string) => {
    const data = { username: value, folderPath: path };
    dispatch(inviteUserAsync(data));
    dispatch(getSharedDataAsync(undefined, path));
    setUserName("");
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10 ${
          open ? "" : "hidden"
        }`}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
          {/* Header */}
          <div className="flex justify-between items-center p-4 ">
            <h2 className="text-xl font-medium">Share : "{fileName}"</h2>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Add people, groups, and calendar events"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* People with access */}
          <div className="px-4 pb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              People with access
            </h3>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  N
                </div>
                <div>
                  <div className="font-medium">Nensi Markana (you)</div>
                  <div className="text-xs text-gray-500">
                    nm.doesdodsoft@gmail.com
                  </div>
                </div>
              </div>
              <span className="text-gray-500 text-sm">Owner</span>
            </div>
          </div>

          {/* General access */}
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              General access
            </h3>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                    className="flex items-center">
                    <span className="font-medium">{accessLevel}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showAccessDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-48">
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setAccessLevel("Anyone with the link");
                          setShowAccessDropdown(false);
                        }}>
                        Anyone with the link
                      </div>
                      <div
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setAccessLevel("Restricted");
                          setShowAccessDropdown(false);
                        }}>
                        Restricted
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 ml-10">
              Only people with access can open with the link
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-4 border-t">
            <button
              className="px-4 py-2 border rounded-md flex items-center text-blue-600 hover:bg-blue-50"
              onClick={() => setOpen(false)}>
              close
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => handleShareWithUser(username)}>
              share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
