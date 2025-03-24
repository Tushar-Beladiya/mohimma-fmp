import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import DropDown from "../../../../../common/DropDown";
import { CustomizePermissionMenu } from "./CustomizePermissionMenu";
interface EditShareMenuProps {
  index: number;
  id: string | number;
  shareWith?: string | null;
  permission: number;
  type: string;
  handleUnShare: (id: string | number, shareWith?: string | null) => void;
}

export const EditShareMenu: React.FC<EditShareMenuProps> = ({
  index,
  id,
  type,
  shareWith,
  permission,
  handleUnShare,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openCustomizePermission, setOpenCustomizePermission] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}>
        <BsThreeDots />
      </button>
      <DropDown
        dropdown={openDropdown === index}
        setDropdown={() => setOpenDropdown(null)}
        contextMenuPosition={{ x: -165, y: 30 }}>
        <div className="w-48 p-4">
          <button
            onClick={() => {
              handleUnShare(id, shareWith);
              setOpenDropdown(null);
            }}
            className="w-full text-sm hover:bg-gray-100 p-2 text-left flex items-center gap-2 text-red-500">
            Unshare
          </button>

          <div className="relative group">
            <button
              onClick={() =>
                setOpenCustomizePermission(!openCustomizePermission)
              }
              data-tooltip-target="tooltip-default"
              className="w-full text-sm hover:bg-gray-100 p-2 text-left flex items-center gap-2">
              Customize Permission
            </button>
            {openCustomizePermission && (
              <div
                className="absolute right-full top-1/2 transform
            -translate-y-1/2 mr-6 w-max">
                <CustomizePermissionMenu
                  initialPermission={permission}
                  onClose={() => setOpenCustomizePermission(false)}
                  shareId={Number(id)}
                  type={type}
                />
              </div>
            )}
          </div>
        </div>
      </DropDown>
    </div>
  );
};
