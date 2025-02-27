import { useState } from "react";
import { CommonModal } from "../../../../common/components/Modal";
import { AppDispatch } from "../../../../Redux/store";
import { useDispatch } from "react-redux";
import { shareFileAsPrivate } from "../../../../Redux/fileshareThunk";
import { shareFolderAsPrivate } from "../../../../Redux/foldershareThunk";

interface SetPasswordModalProps {
  passwordModalData: {
    isOpen: boolean;
    isPasswordModalForFile: boolean;
  };
  filePath: string;
  setPasswordModalData: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      isPasswordModalForFile: boolean;
    }>
  >;
}

const passwordRegex = new RegExp(
  "^(?!.*(abcd|1234|xyz|qwerty|password))(?=.*[a-zA-Z])(?=.*[0-9])(?:(?=.*[^a-zA-Z0-9]).{8,}|[a-zA-Z0-9]{8,})$"
);

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  filePath,
  passwordModalData: { isOpen: open, isPasswordModalForFile },
  setPasswordModalData: setOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const bannedWords = ["abcd", "1234", "Xyz", "qwerty", "password"];

  const validatePassword = (password: string) => {
    if (bannedWords.some((word) => password.toLowerCase().includes(word))) {
      setError(
        "Enter a stronger password. Avoid common patterns like 'abcd' or '1234'."
      );
      return false;
    }
    const isValid = passwordRegex.test(password);
    if (!isValid) {
      setError(
        "Password must be at least 8 characters long, include a letter, a number, and a special character."
      );
      return false;
    }

    setError("");
    return true;
  };

  const HandleShareFileAsPrivate = () => {
    if (!validatePassword(password)) return;
    if (isPasswordModalForFile) {
      dispatch(shareFileAsPrivate(filePath, password));
      setOpen({
        isOpen: false,
        isPasswordModalForFile: false,
      });
    } else {
      dispatch(shareFolderAsPrivate(filePath, password));
      setOpen({
        isOpen: false,
        isPasswordModalForFile: false,
      });
    }
  };

  return (
    <div>
      <CommonModal
        title="Set Password to share file as a private"
        open={open}
        onClose={() => {
          setOpen({
            isOpen: false,
            isPasswordModalForFile: false,
          });
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
