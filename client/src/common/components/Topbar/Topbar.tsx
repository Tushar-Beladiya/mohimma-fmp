import { IoMdSettings } from "react-icons/io";
import { IoFolderOutline, IoPeople } from "react-icons/io5";
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateDropDown from "../../../feature/Folders/views/component/CreateDropDown";
import { getAllUsersAsync, getSharedDataAsync } from "../../../Redux/thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../Redux/store";
import { useFolder } from "../../../context/FolderContext";

interface TopbarProps {
  name: string;
  children: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ name, children }) => {
  const [dropdown, setDropdown] = useState(false);
  const [contextMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.inviteUser);
  const [open, setOpen] = useState(false);
  const { setUsersData, usersData } = useFolder();
  const [userFiltered, setUserFiltered] = useState<string>("");

  const getUsers = useCallback(() => {
    dispatch(getAllUsersAsync());
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      getUsers();
    }
    if (usersData === false) {
      setUserFiltered("");
    }
  }, [open, getUsers, usersData]);

  const handleGetUserData = (username: string) => {
    if (username) {
      if (username === "admin") {
        setUsersData(false);
      } else {
        dispatch(getSharedDataAsync(username, undefined));
        setUsersData(true);
        setUserFiltered(username);
      }
    }
  };
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
          {userFiltered && (
            <div className="p-2 rounded-2xl bg-white">
              <p className="text-sm">{userFiltered}</p>
            </div>
          )}
          <div className="relative group">
            <button
              onClick={() => {
                setOpen(!open);
              }}>
              <IoPeople className="text-2xl text-grey-400" />
            </button>
            {open && users.length > 0 && (
              <div
                // className="absolute bottom-0 right-0 w-48 bg-white rounded-lg shadow-lg p-4 z-10"
                className="absolute mt-2 w-auto right-0 rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-10">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="w-full text-sm hover:bg-gray-100 p-2 text-left flex items-center gap-2 text-small">
                    <div className="font-medium">
                      <button
                        onClick={() => {
                          handleGetUserData(user);
                          setOpen(false);
                        }}>
                        {user}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <IoMdSettings className="text-2xl text-grey-400" />
        </div>
      </nav>
      <main className="h-[800px] overflow-y-scroll m-4 bg-white rounded-xl">
        {children}
      </main>
    </div>
  );
};
