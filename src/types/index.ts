export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isDeleted: number; // 0: chưa xóa, 1: đã xóa
}