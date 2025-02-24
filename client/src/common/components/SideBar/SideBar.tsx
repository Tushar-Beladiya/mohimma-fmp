import { PiFolderSimple } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFolder } from "../../../context/FolderContext";
import { Topbar } from "../Topbar";

interface SideBarProps {
  children: React.ReactNode;
}

export const SideBar: React.FC<SideBarProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("All Files");
  const { setFolderPath } = useFolder();
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === "All Files") {
      setFolderPath("");
    }
  };

  return (
    <div>
      <div className="flex gap-2 h-screen">
        <div className="w-2/12 bg-[#374955] text-[#c1c7ce] rounded-r-3xl">
          <div className="flex justify-start m-4">
            <h1 className="text-xl antialiased md:subpixel-antialiased font-semibold uppercase p-2">
              <Link to="/"> workspace</Link>
            </h1>
          </div>
          <div className="flex flex-col flex-1 min-h-0 overflow-y-auto m-4 text-md font-semibold">
            <div className="h-full">
              <div
                className={`flex items-center justify-start hover:bg-sky-600/10 rounded-full p-2 my-2 w-full cursor-pointer ${
                  activeTab === "All Files" ? "bg-sky-600/10" : ""
                }`}
                onClick={() => handleTabClick("All Files")}>
                <PiFolderSimple className="text-2xl" />
                <span className="pl-2 hover:text-grey-900">
                  <Link to="/folder">All Files</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
        <Topbar name="All Files">{children}</Topbar>
      </div>
    </div>
  );
};
