import { AiOutlineDownload } from "react-icons/ai";
import Button from "../../../../common/Button";
import {
  MdOutlineDeleteOutline,
  MdOutlineDriveFileRenameOutline,
  MdOutlineFileCopy,
} from "react-icons/md";

interface ActionsProps {
  isFolder: boolean;
  downloadOnClick: () => void;
  copyOnClick?: () => void;
  renameOnClick: () => void;
  deleteOnClick: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  isFolder,
  downloadOnClick,
  copyOnClick,
  renameOnClick,
  deleteOnClick,
}) => {
  return (
    <div>
      <div className="flex bg-gray-50 p-1 rounded-lg mr-1 shadow-sm border border-gray-100">
        {/* Download Button */}
        <Button
          onClick={() => downloadOnClick()}
          className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-blue-500 hover:text-white transition-colors">
          <AiOutlineDownload className="text-lg" />
        </Button>

        {/* Copy Button */}
        {!isFolder && (
          <Button
            className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-green-500 hover:text-white transition-colors"
            onClick={() => {
              copyOnClick && copyOnClick();
            }}>
            <MdOutlineFileCopy className="text-lg" />
          </Button>
        )}

        {/* Rename Button */}
        <Button
          className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-amber-500 hover:text-white transition-colors"
          onClick={() => {
            renameOnClick();
          }}>
          <MdOutlineDriveFileRenameOutline className="text-lg" />
        </Button>

        {/* Delete Button */}
        <Button
          onClick={() => {
            deleteOnClick();
          }}
          className="p-1.5 mx-0.5 rounded-md text-gray-600 hover:bg-red-500 hover:text-white transition-colors">
          <MdOutlineDeleteOutline className="text-lg" />
        </Button>
      </div>
    </div>
  );
};

export default Actions;
