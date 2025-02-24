import React from "react";

interface DropDownProps {
  dropdown: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  children: React.ReactNode;
}

const DropDown: React.FC<DropDownProps> = ({
  dropdown,
  contextMenuPosition,
  children,
}) => {
  return (
    <>
      {dropdown && (
        <div
          id="dropdown-menu"
          className="absolute mt-2 w-36 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-10"
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
