import { useEffect, useState } from "react";
import { FoldersViews } from "../../feature/Folders";
import { Toaster } from "react-hot-toast";
import CreateDropDown from "../../feature/Folders/views/component/CreateDropDown";
import { SideBar } from "../../common/components/SideBar";

export const FoldersPage = () => {
  const [dropdown, setDropdown] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdown(true);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };
  const handleLeftClick = () => {
    setDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleLeftClick);
    return () => {
      document.removeEventListener("click", handleLeftClick);
    };
  }, []);
  return (
    <div className="bg-[#f0f2f5] h-screen">
      <SideBar>
        <div onContextMenu={handleRightClick} className="h-full w-full">
          <FoldersViews />
          <CreateDropDown
            dropdown={dropdown}
            setDropdown={setDropdown}
            contextMenuPosition={contextMenuPosition}
          />
        </div>
        <Toaster position="top-left" />
      </SideBar>
    </div>
  );
};
