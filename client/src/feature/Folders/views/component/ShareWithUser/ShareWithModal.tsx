import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSharedDataAsync,
  getSharedDataAsync,
  inviteUserAsync,
} from "../../../../../Redux/thunk";
import { AppDispatch, RootState } from "../../../../../Redux/store";
import Button from "../../../../../common/Button";
import { MdContentCopy } from "react-icons/md";
import { IoLinkOutline } from "react-icons/io5";
import { EditShareMenu } from "./EditShareMenu";
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
  const { sharedFolders } = useSelector((state: RootState) => state.inviteUser);

  const [username, setUserName] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (path && open) {
      dispatch(getSharedDataAsync(undefined, path));
    }
  }, [open]);

  const handleShareWithUser = (value: string) => {
    const data = { username: value, folderPath: path };
    if (value) {
      dispatch(inviteUserAsync(data));
    } else {
      return;
    }
    setUserName("");
  };

  const handleUnShare = (id: string | number, shareWith?: string | null) => {
    if (id && shareWith != null) {
      dispatch(deleteSharedDataAsync(id as string, shareWith));
    }
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center h-full overflow-y-scroll z-10 ${
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
          <div className=" px-4 pb-2 h-96 overflow-y-scroll">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              People with access
            </h3>

            {sharedFolders &&
              sharedFolders.map((folder: any, index: number) => (
                <div key={index}>
                  {folder.shareTypeSystemName === "user" ? (
                    <div className="flex items-center justify-between mb-4 relative">
                      <div className="flex items-center">
                        <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          {folder.sharedWith.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{folder.sharedWith}</div>
                          <div className="text-xs text-gray-500">
                            {folder.emails}
                          </div>
                        </div>
                      </div>
                      <EditShareMenu
                        index={index}
                        id={folder.id}
                        shareWith={folder.sharedWith}
                        handleUnShare={handleUnShare}
                        permission={folder.permissions}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                          <IoLinkOutline />
                        </div>
                        <div>
                          <div className="font-medium">Shared link</div>
                          <div className="text-xs text-gray-500">
                            {folder.shareTypeSystemName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(folder.url);
                          }}
                          className="text-blue-600">
                          <MdContentCopy />
                        </Button>
                        <EditShareMenu
                          index={index}
                          id={folder.id}
                          shareWith={folder.sharedWith}
                          handleUnShare={handleUnShare}
                          permission={folder.permissions}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
