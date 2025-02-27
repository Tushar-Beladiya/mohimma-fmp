// Get file extension
export const getFileExtension = (filename: string): string => {
  if (filename === "") return "";
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
};
