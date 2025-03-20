import { useState } from "react";
import { updateSharePermissionAsync } from "../../../../../Redux/thunk";
import { AppDispatch } from "../../../../../Redux/store";
import { useDispatch } from "react-redux";

enum Permission {
  Read = 1,
  Update = 2,
  Create = 4,
  Delete = 8,
  Share = 16,
  All = 31,
}

interface CustomizePermissionMenuProps {
  onClose: () => void;
  initialPermission?: number;
  shareId: number;
  type: string;
}

export const CustomizePermissionMenu: React.FC<
  CustomizePermissionMenuProps
> = ({ onClose, initialPermission, shareId, type }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPermission, setCurrentPermission] = useState<number>(
    initialPermission ?? Permission.All
  );
  const [customPermissions, setCustomPermissions] = useState<boolean>(
    initialPermission !== Permission.All
  );

  // Helper function to check if a permission is set
  const hasPermission = (permission: Permission): boolean => {
    return (currentPermission & permission) === permission;
  };

  // Helper function to toggle a permission
  const togglePermission = (permission: Permission) => {
    setCurrentPermission((prev) => {
      if (hasPermission(permission)) {
        return prev & ~permission; // Remove the permission
      } else {
        return prev | permission; // Add the permission
      }
    });
  };

  // Handle "All" permission toggle
  const handleCustomPermissionToggle = () => {
    setCustomPermissions((prev) => !prev);
  };

  const updateSharePermission = () => {
    if (typeof shareId === "number" && shareId & currentPermission) {
      dispatch(updateSharePermissionAsync(shareId, currentPermission));
    }
  };
  return (
    <div
      className={`w-56 bg-white rounded-lg shadow-md border border-gray-200`}>
      <div className="p-4">
        <div className="flex items-center ">
          <div className="relative">
            <input
              type="checkbox"
              id="customPermissions"
              checked={customPermissions}
              onChange={handleCustomPermissionToggle}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label
              htmlFor="customPermissions"
              className="ml-2 text-gray-800 text-sm">
              Custom permissions
            </label>
          </div>
        </div>

        {customPermissions && (
          <div className="pl-8 pt-4 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="read"
                checked={true}
                disabled
                onChange={() => togglePermission(Permission.Read)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="read" className="ml-2 text-gray-800 text-sm">
                Read
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="create"
                checked={hasPermission(Permission.Create)}
                onChange={() => togglePermission(Permission.Create)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="create" className="ml-2 text-gray-800 text-sm">
                Create
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="update"
                checked={hasPermission(Permission.Update)}
                onChange={() => togglePermission(Permission.Update)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="edit" className="ml-2 text-gray-800 text-sm">
                Edit
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="delete"
                checked={hasPermission(Permission.Delete)}
                onChange={() => togglePermission(Permission.Delete)}
                className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="delete" className="ml-2 text-gray-800 text-sm">
                Delete
              </label>
            </div>
            {type !== "publicLink" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="share"
                  checked={hasPermission(Permission.Share)}
                  onChange={() => togglePermission(Permission.Share)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="share" className="ml-2 text-gray-800 text-sm">
                  Share
                </label>
              </div>
            )}
            <div className="flex justify-between items-center px-4 py-2">
              <button
                className="text-gray-600 hover:text-gray-800 text-sm"
                onClick={onClose}>
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm"
                onClick={() => {
                  updateSharePermission();
                  onClose();
                }}>
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
