export interface FileItem {
  Index: number;
  Name: string;
  Size: number;
  Type: string;
  Bytes?: String | ArrayBuffer;
  ServerPath?: String;
  Uploaded: boolean;
}
