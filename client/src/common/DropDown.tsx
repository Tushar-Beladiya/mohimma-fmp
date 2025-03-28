// import React from "react";

import { useEffect, useRef } from "react";

// interface DropDownProps {
//   dropdown: boolean;
//   contextMenuPosition: { x: number; y: number } | null;
//   children: React.ReactNode;
// }

// const DropDown: React.FC<DropDownProps> = ({
//   dropdown,
//   contextMenuPosition,
//   children,
// }) => {
//   return (
//     <>
//       {dropdown && (
//         <div
//           id="dropdown-menu"
//           className="absolute mt-2 w-auto origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-10 "
//           style={{
//             top: contextMenuPosition ? `${contextMenuPosition.y}px` : "auto",
//             left: contextMenuPosition ? `${contextMenuPosition.x}px` : "auto",
//           }}>
//           {children}
//         </div>
//       )}
//     </>
//   );
// };

// export default DropDown;

interface DropDownProps {
  dropdown: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  children: React.ReactNode;
  setDropdown: (value: boolean) => void;
}

const DropDown: React.FC<DropDownProps> = ({
  dropdown,
  contextMenuPosition,
  children,
  setDropdown,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to handle clicks outside the dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    };

    // Add event listener when dropdown is open
    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener when component unmounts or dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown, setDropdown]);

  return (
    <>
      {dropdown && (
        <div
          ref={dropdownRef}
          id="dropdown-menu"
          className="absolute mt-2 w-auto origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-10 "
          style={{
            top: contextMenuPosition ? `${contextMenuPosition.y}px` : "auto",
            left: contextMenuPosition ? `${contextMenuPosition.x}px` : "auto",
          }}>
          {children}
        </div>
      )}
    </>
  );
};

export default DropDown;
