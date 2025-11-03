// import * as SQLite from 'expo-sqlite';

// const db = SQLite.openDatabaseSync('notes.db');

// // Khởi tạo database
// export const initDatabase = () => {
//   try {
//     db.execSync(`
//       CREATE TABLE IF NOT EXISTS notes (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         content TEXT NOT NULL,
//         createdAt TEXT NOT NULL,
//         isDeleted INTEGER DEFAULT 0
//       );
//     `);
//     console.log('✅ Database initialized successfully');
//   } catch (error) {
//     console.error('❌ Error initializing database:', error);
//   }
// };

// // CREATE - Thêm ghi chú mới
// export const addNote = (title: string, content: string) => {
//   try {
//     const createdAt = new Date().toISOString();
//     const result = db.runSync(
//       'INSERT INTO notes (title, content, createdAt, isDeleted) VALUES (?, ?, ?, 0)',
//       [title, content, createdAt]
//     );
//     console.log('✅ Note added with ID:', result.lastInsertRowId);
//     return result.lastInsertRowId;
//   } catch (error) {
//     console.error('❌ Error adding note:', error);
//     return null;
//   }
// };

// // READ - Lấy tất cả ghi chú (chưa xóa)
// export const getAllNotes = () => {
//   try {
//     const notes = db.getAllSync('SELECT * FROM notes WHERE isDeleted = 0 ORDER BY id DESC');
//     console.log('✅ Fetched notes:', notes.length);
//     return notes;
//   } catch (error) {
//     console.error('❌ Error fetching notes:', error);
//     return [];
//   }
// };

// // READ - Lấy ghi chú đã xóa
// export const getDeletedNotes = () => {
//   try {
//     const notes = db.getAllSync('SELECT * FROM notes WHERE isDeleted = 1 ORDER BY id DESC');
//     console.log('✅ Fetched deleted notes:', notes.length);
//     return notes;
//   } catch (error) {
//     console.error('❌ Error fetching deleted notes:', error);
//     return [];
//   }
// };

// // UPDATE - Cập nhật ghi chú
// export const updateNote = (id: number, title: string, content: string) => {
//   try {
//     db.runSync(
//       'UPDATE notes SET title = ?, content = ? WHERE id = ?',
//       [title, content, id]
//     );
//     console.log('✅ Note updated:', id);
//     return true;
//   } catch (error) {
//     console.error('❌ Error updating note:', error);
//     return false;
//   }
// };

// // DELETE - Xóa mềm (chuyển vào thùng rác)
// export const softDeleteNote = (id: number) => {
//   try {
//     db.runSync('UPDATE notes SET isDeleted = 1 WHERE id = ?', [id]);
//     console.log('✅ Note soft deleted:', id);
//     return true;
//   } catch (error) {
//     console.error('❌ Error soft deleting note:', error);
//     return false;
//   }
// };

// // RESTORE - Khôi phục ghi chú từ thùng rác
// export const restoreNote = (id: number) => {
//   try {
//     db.runSync('UPDATE notes SET isDeleted = 0 WHERE id = ?', [id]);
//     console.log('✅ Note restored:', id);
//     return true;
//   } catch (error) {
//     console.error('❌ Error restoring note:', error);
//     return false;
//   }
// };

// // DELETE - Xóa vĩnh viễn
// export const permanentDeleteNote = (id: number) => {
//   try {
//     db.runSync('DELETE FROM notes WHERE id = ?', [id]);
//     console.log('✅ Note permanently deleted:', id);
//     return true;
//   } catch (error) {
//     console.error('❌ Error permanently deleting note:', error);
//     return false;
//   }
// };

// // SEARCH - Tìm kiếm ghi chú
// export const searchNotes = (query: string, includeDeleted: boolean = false) => {
//   try {
//     const isDeletedFilter = includeDeleted ? '1' : '0';
//     const notes = db.getAllSync(
//       `SELECT * FROM notes 
//        WHERE (title LIKE ? OR content LIKE ?) 
//        AND isDeleted = ? 
//        ORDER BY id DESC`,
//       [`%${query}%`, `%${query}%`, isDeletedFilter]
//     );
//     console.log('✅ Search results:', notes.length);
//     return notes;
//   } catch (error) {
//     console.error('❌ Error searching notes:', error);
//     return [];
//   }
// };

// export default db;



import * as SQLite from 'expo-sqlite';

// Mở database
const db = SQLite.openDatabaseSync('notes.db');

// Định nghĩa interface Note
export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isDeleted: number; // 0: chưa xóa, 1: đã xóa
}

// Khởi tạo database
export const initDatabase = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0
      );
    `);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// CREATE - Thêm ghi chú mới
export const addNote = (title: string, content: string): number | null => {
  try {
    const createdAt = new Date().toISOString();
    const result = db.runSync(
      'INSERT INTO notes (title, content, createdAt, isDeleted) VALUES (?, ?, ?, 0)',
      [title, content, createdAt]
    );
    console.log('✅ Note added with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('❌ Error adding note:', error);
    return null;
  }
};

// READ - Lấy tất cả ghi chú chưa xóa
export const getAllNotes = (): Note[] => {
  try {
    const notes = db.getAllSync(
      'SELECT * FROM notes WHERE isDeleted = 0 ORDER BY id DESC'
    );
    return notes as Note[];
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    return [];
  }
};

// READ - Lấy ghi chú đã xóa (thùng rác)
export const getDeletedNotes = (): Note[] => {
  try {
    const notes = db.getAllSync(
      'SELECT * FROM notes WHERE isDeleted = 1 ORDER BY id DESC'
    );
    return notes as Note[];
  } catch (error) {
    console.error('❌ Error fetching deleted notes:', error);
    return [];
  }
};

// UPDATE - Cập nhật ghi chú
export const updateNote = (id: number, title: string, content: string): boolean => {
  try {
    db.runSync('UPDATE notes SET title = ?, content = ? WHERE id = ?', [title, content, id]);
    console.log('✅ Note updated:', id);
    return true;
  } catch (error) {
    console.error('❌ Error updating note:', error);
    return false;
  }
};

// DELETE - Xóa mềm (chuyển vào thùng rác)
export const softDeleteNote = (id: number): boolean => {
  try {
    db.runSync('UPDATE notes SET isDeleted = 1 WHERE id = ?', [id]);
    console.log('✅ Note soft deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error soft deleting note:', error);
    return false;
  }
};

// RESTORE - Khôi phục ghi chú từ thùng rác
export const restoreNote = (id: number): boolean => {
  try {
    db.runSync('UPDATE notes SET isDeleted = 0 WHERE id = ?', [id]);
    console.log('✅ Note restored:', id);
    return true;
  } catch (error) {
    console.error('❌ Error restoring note:', error);
    return false;
  }
};

// DELETE - Xóa vĩnh viễn
export const permanentDeleteNote = (id: number): boolean => {
  try {
    db.runSync('DELETE FROM notes WHERE id = ?', [id]);
    console.log('✅ Note permanently deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error permanently deleting note:', error);
    return false;
  }
};

// SEARCH - Tìm kiếm ghi chú
export const searchNotes = (query: string, includeDeleted: boolean = false): Note[] => {
  try {
    const isDeletedFilter = includeDeleted ? '1' : '0';
    const notes = db.getAllSync(
      `SELECT * FROM notes 
       WHERE (title LIKE ? OR content LIKE ?) 
       AND isDeleted = ? 
       ORDER BY id DESC`,
      [`%${query}%`, `%${query}%`, isDeletedFilter]
    );
    return notes as Note[];
  } catch (error) {
    console.error('❌ Error searching notes:', error);
    return [];
  }
};

export default db;
