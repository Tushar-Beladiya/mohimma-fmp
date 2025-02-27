import { IoCloseSharp } from "react-icons/io5";
import Button from "../../Button";

interface CommonModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  open: boolean;
  onConfirm?: () => void;
  className?: string;
  width?: string;
  height?: string;
}

export const CommonModal: React.FC<CommonModalProps> = ({
  title,
  children,
  onClose,
  open,
  onConfirm,
  width = "w-96",
  height = "",
}) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-75 z-20 ${
        !open && "hidden"
      }`}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg ${width} ${height} m-auto mt-20 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          <IoCloseSharp size={24} />
        </button>
        <div className="modal-content">
          <h3 className="text-xl py-2">{title}</h3>
          {children}
          <div className="flex justify-end gap-4 mt-4">
            <Button
              className="text-white bg-red-400 px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </Button>
            {onConfirm && (
              <Button
                className="bg-sky-800 text-white px-4 py-2 rounded-md"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
