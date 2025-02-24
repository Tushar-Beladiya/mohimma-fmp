import { IoIosInformationCircle, IoMdSettings } from "react-icons/io";
import { IoFolderOutline } from "react-icons/io5";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateDropDown from "../../../feature/Folders/views/component/CreateDropDown";

interface TopbarProps {
  name: string;
  children: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ name, children }) => {
  const [dropdown, setDropdown] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return (
    <div className="w-10/12 h-screen">
      <nav className="flex justify-between top-0 p-2">
        <div>
          <div className="flex gap-2 items-center text-2xl">
            <IoFolderOutline />
            <h1 className="">{name}</h1>
          </div>
          <div className=" pt-2">
            <button
              className="bg-blue-500/30 text-black p-2 px-2 rounded flex items-center gap-2"
              onClick={() => setDropdown(!dropdown)}>
              <FaPlus className="text-sm" />
              <span>Create</span>
            </button>
            <CreateDropDown
              dropdown={dropdown}
              setDropdown={setDropdown}
              contextMenuPosition={contextMenuPosition}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            className=" pl-4 p-2 rounded-3xl bg-white"
            type="text"
            placeholder="Search"
          />
          <IoMdSettings className="text-2xl text-grey-400" />
          <IoIosInformationCircle className="text-2xl text-grey-400" />
        </div>
      </nav>
      <main className="h-[800px] overflow-y-scroll m-4 bg-white rounded-xl">
        {children}
      </main>
    </div>
  );
};
