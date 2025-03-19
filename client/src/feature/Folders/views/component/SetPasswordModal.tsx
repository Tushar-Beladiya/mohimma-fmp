import { useEffect, useState } from "react";
import { CommonModal } from "../../../../common/components/Modal";
import { AppDispatch } from "../../../../Redux/store";
import { useDispatch } from "react-redux";
import { shareFileAsPrivate } from "../../../../Redux/fileshareThunk";
import { shareFolderAsPrivate } from "../../../../Redux/foldershareThunk";
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setPassword("");
    }
  }, [open]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const bannedWords = ["abcd", "1234", "Xyz", "qwerty", "password"];

  const validatePassword = (password: string) => {
    if (bannedWords.some((word) => password.toLowerCase().includes(word))) {
      setError(
        "Enter a stronger password. Avoid common patterns like 'abcd' or '1234'."
      );
      console.log("error", error);
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
      setPassword("");
    } else {
      dispatch(shareFolderAsPrivate(filePath, password));
      setOpen({
        isOpen: false,
        isPasswordModalForFile: false,
      });
      setPassword("");
    }
  };

  return (
    <div>
      <CommonModal
        title="Set Password for Private Sharing"
        open={open}
        onClose={() => {
          setOpen({
            isOpen: false,
            isPasswordModalForFile: false,
          });
          setPassword("");
        }}
        onConfirm={HandleShareFileAsPrivate}>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="border border-gray-300 p-2 rounded-md w-full pr-10"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {!showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default SetPasswordModal;
