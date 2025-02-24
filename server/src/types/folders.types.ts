export interface FileItem {
  name: string;
  path: string;
  type: 'file';
}

export interface FolderItem {
  name: string;
  path: string;
  type: 'directory';
}

export interface FolderContents {
  path: string;
  contents: {
    files: FileItem[];
    folders: FolderItem[];
    totalFiles: number;
    totalFolders: number;
  };
}
