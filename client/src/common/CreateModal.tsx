import { ChangeEvent, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface CreateModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalType: string;
  onConfirm?: (name: string) => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  closeModal,
  modalType,
  onConfirm,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (onConfirm && name.trim()) {
      onConfirm(name); // Call the function passed from parent (e.g., create folder)
      closeModal();
      setName("");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-500 bg-opacity-75 z-20 ${
        !isOpen && "hidden"
      }`}
      onClick={closeModal}>
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 m-auto mt-20 relative"
        onClick={(e) => e.stopPropagation()}>
        <div
          className="absolute top-4 right-4 cursor-pointer"
          onClick={closeModal}>
          <IoCloseSharp />
        </div>
        <h3 className="text-2xl mb-4">{`Create ${modalType}`}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">{`${modalType} Name`}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button
              type="submit"
              className="bg-sky-800 text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}>
              Create
            </button>
            <button
              type="button"
              className="text-red-600 bg-red-200 px-4 py-2 rounded-md"
              onClick={closeModal}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
