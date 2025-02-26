import { useState } from "react";
import { CommonModal } from "../../../../common/components/Modal";
import { AppDispatch } from "../../../../Redux/store";
import { useDispatch } from "react-redux";
import { shareFileAsPrivate } from "../../../../Redux/fileshareThunk";

interface SetPasswordModalProps {
  filePath: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const passwordRegex = new RegExp(
  "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$"
);

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  filePath,
  open,
  setOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password: string) => {
    const isValid = passwordRegex.test(password);
    setError(
      isValid
        ? ""
        : "Password must be at least 8 characters long, include a letter, a number, and a special character."
    );
    return isValid;
  };

  const HandleShareFileAsPrivate = () => {
    if (!validatePassword(password)) return;
    console.log("Share file as private with password:", password);
    dispatch(shareFileAsPrivate(filePath, password));
    setOpen(false);
  };

  return (
    <div>
      <CommonModal
        title="Set Password to share file as a private"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={HandleShareFileAsPrivate}>
        <div>
          <input
            type="password"
            placeholder="Enter Password"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </CommonModal>
    </div>
  );
};

export default SetPasswordModal;
