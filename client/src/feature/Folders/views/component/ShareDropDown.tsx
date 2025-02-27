import { useState } from "react";
import { AiOutlineShareAlt, AiOutlineLink } from "react-icons/ai";
import DropDown from "../../../../common/DropDown";
import Button from "../../../../common/Button";
import { FaRegShareFromSquare } from "react-icons/fa6";

interface ShareDropDownProps {
  file: { path: string; name: string; isFile: boolean };
  index: number;
  handleShare: (path: string, name: string) => void;
  copyToClipboard: (path: string) => void;
  setStandardPath: React.Dispatch<React.SetStateAction<string>>;
  setPasswordModalData: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      isPasswordModalForFile: boolean;
    }>
  >;
}

const ShareDropDown: React.FC<ShareDropDownProps> = ({
  file,
  index,
  handleShare,
  setStandardPath,
  setPasswordModalData,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  return (
    <div className="relative">
      <Button
        onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
        className="bg-green-500 text-white hover:bg-green-600">
        <AiOutlineShareAlt className="text-lg" />
      </Button>
      <DropDown
        dropdown={openDropdown === index}
        contextMenuPosition={{ x: -100, y: 30 }}>
        <button
          onClick={() => {
            handleShare(file.path, file.name);
            setOpenDropdown(null);
          }}
          className="w-full text-sm hover:bg-gray-100 p-2 text-left flex items-center gap-2">
          <FaRegShareFromSquare />
          Share As Public
        </button>
        <button
          onClick={() => {
            setStandardPath(file.path || "");
            setPasswordModalData({
              isOpen: true,
              isPasswordModalForFile: file.isFile ? true : false,
            });
            setOpenDropdown(null);
          }}
          className="w-full text-sm hover:bg-gray-100 p-2 text-left flex items-center gap-2">
          <FaRegShareFromSquare />
          Share As Private
        </button>
        <button
          onClick={() => {
            handleShare(file.path, file.name);
            setOpenDropdown(null);
          }}
          className="w-full text-sm hover:bg-gray-100 p-2 text-left flex items-center gap-2">
          <AiOutlineLink /> Copy Link
        </button>
      </DropDown>
    </div>
  );
};

export default ShareDropDown;
