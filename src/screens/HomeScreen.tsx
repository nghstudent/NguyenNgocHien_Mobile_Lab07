// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   StatusBar,
//   Modal,
//   Alert,
//   RefreshControl,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import NoteItem from "../components/NoteItem";
// import AddNoteScreen from "./AddNoteScreen";
// import EditNoteScreen from "./EditNoteScreen";
// import {
//   initDatabase,
//   getAllNotes,
//   getDeletedNotes,
//   addNote,
//   updateNote,
//   softDeleteNote,
//   restoreNote,
//   permanentDeleteNote,
//   searchNotes,
// } from "../database/db";

// export interface Note {
//   id: number;
//   title: string;
//   content: string;
//   createdAt: string;
//   isDeleted: number;
// }

// type ActiveTab = "notes" | "trash";

// export default function HomeScreen() {
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showAddScreen, setShowAddScreen] = useState(false);
//   const [showEditScreen, setShowEditScreen] = useState(false);
//   const [selectedNote, setSelectedNote] = useState<Note | null>(null);
//   const [activeTab, setActiveTab] = useState<ActiveTab>("notes");
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     initDatabase();
//     loadNotes();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() !== "") {
//       const isDeleted = activeTab === "trash";
//       const results = searchNotes(searchQuery, isDeleted);
//       setNotes(results);
//     } else {
//       loadNotes();
//     }
//   }, [searchQuery, activeTab]);

//   const loadNotes = () => {
//     if (activeTab === "notes") {
//       setNotes(getAllNotes());
//     } else {
//       setNotes(getDeletedNotes());
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadNotes();
//     setRefreshing(false);
//   };

//   const handleTabChange = (tab: ActiveTab) => {
//     setActiveTab(tab);
//   };

//   const handleNoteAdded = () => {
//     setShowAddScreen(false);
//     loadNotes();
//   };

//   const handleNoteUpdated = () => {
//     setShowEditScreen(false);
//     setSelectedNote(null);
//     loadNotes();
//   };

//   const handleNotePress = (note: Note) => {
//     setSelectedNote(note);
//     setShowEditScreen(true);
//   };

//   const handleDeleteConfirmation = (note: Note) => {
//     if (activeTab === "notes") {
//       Alert.alert(
//         "Xác nhận xóa",
//         `Bạn có chắc chắn muốn chuyển ghi chú "${note.title}" vào thùng rác?`,
//         [
//           { text: "Hủy", style: "cancel" },
//           {
//             text: "Chuyển vào thùng rác",
//             style: "destructive",
//             onPress: () => {
//               softDeleteNote(note.id);
//               loadNotes();
//             },
//           },
//         ]
//       );
//     } else {
//       Alert.alert(
//         "Xác nhận xóa vĩnh viễn",
//         `Bạn có chắc chắn muốn xóa ghi chú "${note.title}" vĩnh viễn?`,
//         [
//           { text: "Hủy", style: "cancel" },
//           {
//             text: "Xóa vĩnh viễn",
//             style: "destructive",
//             onPress: () => {
//               permanentDeleteNote(note.id);
//               loadNotes();
//             },
//           },
//         ]
//       );
//     }
//   };

//   const handleRestore = (note: Note) => {
//     restoreNote(note.id);
//     loadNotes();
//   };

//   const renderNoteItem = ({ item }: { item: Note }) => (
//     <NoteItem
//       note={item}
//       onPress={() => handleNotePress(item)}
//       onLongPress={() =>
//         activeTab === "notes"
//           ? handleDeleteConfirmation(item)
//           : Alert.alert(
//               "Tùy chọn",
//               `Bạn muốn làm gì với "${item.title}"?`,
//               [
//                 { text: "Hủy", style: "cancel" },
//                 { text: "Khôi phục", onPress: () => handleRestore(item) },
//                 {
//                   text: "Xóa vĩnh viễn",
//                   style: "destructive",
//                   onPress: () => handleDeleteConfirmation(item),
//                 },
//               ]
//             )
//       }
//     />
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#6200EE" />

//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>
//           {activeTab === "notes" ? "Note App" : "Thùng rác"}
//         </Text>
//         <Text style={styles.headerSubtitle}>{notes.length} ghi chú</Text>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <Text style={styles.searchIcon}>🔍</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder={
//             activeTab === "notes"
//               ? "Tìm kiếm trong ghi chú..."
//               : "Tìm kiếm trong thùng rác..."
//           }
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#999"
//         />
//         {searchQuery.length > 0 && (
//           <TouchableOpacity onPress={() => setSearchQuery("")}>
//             <Text style={styles.clearIcon}>✕</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Notes List */}
//       <FlatList
//         data={notes}
//         renderItem={renderNoteItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyIcon}>
//               {activeTab === "notes" ? "📝" : "🗑️"}
//             </Text>
//             <Text style={styles.emptyText}>
//               {searchQuery
//                 ? "Không tìm thấy ghi chú"
//                 : activeTab === "notes"
//                 ? "Chưa có ghi chú nào"
//                 : "Thùng rác trống"}
//             </Text>
//           </View>
//         }
//       />

//       {/* Add Button */}
//       {activeTab === "notes" && (
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={() => setShowAddScreen(true)}
//         >
//           <Text style={styles.addButtonText}>+</Text>
//         </TouchableOpacity>
//       )}

//       {/* Bottom Nav */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity
//           style={[styles.navItem, activeTab === "notes" && styles.navItemActive]}
//           onPress={() => handleTabChange("notes")}
//         >
//           <Text style={styles.navIcon}>📝</Text>
//           <Text style={[styles.navText, activeTab === "notes" && styles.navTextActive]}>
//             Ghi chú
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.navItem, activeTab === "trash" && styles.navItemActive]}
//           onPress={() => handleTabChange("trash")}
//         >
//           <Text style={styles.navIcon}>🗑️</Text>
//           <Text style={[styles.navText, activeTab === "trash" && styles.navTextActive]}>
//             Thùng rác
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Modals */}
//       <Modal visible={showAddScreen} animationType="slide">
//         <AddNoteScreen navigation={{ goBack: () => setShowAddScreen(false) }} onNoteAdded={handleNoteAdded} />
//       </Modal>

//       <Modal visible={showEditScreen} animationType="slide">
//         {selectedNote && (
//           <EditNoteScreen
//             navigation={{ goBack: () => setShowEditScreen(false) }}
//             note={selectedNote}
//             onNoteUpdated={handleNoteUpdated}
//           />
//         )}
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F5F5F5" },
//   header: { backgroundColor: "#6200EE", padding: 20, paddingBottom: 16 },
//   headerTitle: { fontSize: 28, fontWeight: "bold", color: "#FFFFFF", marginBottom: 4 },
//   headerSubtitle: { fontSize: 14, color: "#E0E0E0" },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     margin: 15,
//     marginBottom: 10,
//     borderRadius: 12,
//     paddingHorizontal: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   searchIcon: { fontSize: 18, marginRight: 10 },
//   searchInput: { flex: 1, padding: 12, fontSize: 16, color: "#333" },
//   clearIcon: { fontSize: 20, color: "#999", padding: 5 },
//   listContainer: { padding: 15, paddingBottom: 100 },
//   emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
//   emptyIcon: { fontSize: 64, marginBottom: 16 },
//   emptyText: { fontSize: 18, color: "#666", fontWeight: "600", marginBottom: 8 },
//   addButton: {
//     position: "absolute",
//     right: 20,
//     bottom: 90,
//     backgroundColor: "#6200EE",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#6200EE",
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   addButtonText: { fontSize: 36, color: "#FFF", fontWeight: "300", marginTop: -2 },
//   bottomNav: { flexDirection: "row", backgroundColor: "#FFF", borderTopWidth: 1, paddingBottom: 5 },
//   navItem: { flex: 1, paddingVertical: 10, alignItems: "center" },
//   navItemActive: { borderTopWidth: 2, borderTopColor: "#6200EE" },
//   navIcon: { fontSize: 20 },
//   navText: { fontSize: 11, color: "#999", fontWeight: "500" },
//   navTextActive: { color: "#6200EE", fontWeight: "600" },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoteItem from "../components/NoteItem";
import AddNoteScreen from "./AddNoteScreen";
import EditNoteScreen from "./EditNoteScreen";
import {
  initDatabase,
  getAllNotes,
  getDeletedNotes,
  addNote,
  updateNote,
  softDeleteNote,
  restoreNote,
  permanentDeleteNote,
  searchNotes,
} from "../database/db";

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isDeleted: number;
}

type ActiveTab = "notes" | "trash";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [showEditScreen, setShowEditScreen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("notes");
  const [refreshing, setRefreshing] = useState(false);

  // Link API MockAPI (paste của bạn)
  const [apiLink, setApiLink] = useState(
    "https://your-mockapi-link.mockapi.io/notes"
  );

  useEffect(() => {
    initDatabase();
    loadNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const isDeleted = activeTab === "trash";
      const results = searchNotes(searchQuery, isDeleted);
      setNotes(results);
    } else {
      loadNotes();
    }
  }, [searchQuery, activeTab]);

  const loadNotes = () => {
    if (activeTab === "notes") {
      setNotes(getAllNotes());
    } else {
      setNotes(getDeletedNotes());
    }
  };

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadNotes();
    setRefreshing(false);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const handleNoteAdded = () => {
    setShowAddScreen(false);
    loadNotes();
  };

  const handleNoteUpdated = () => {
    setShowEditScreen(false);
    setSelectedNote(null);
    loadNotes();
  };

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setShowEditScreen(true);
  };

  const handleDeleteConfirmation = (note: Note) => {
    if (activeTab === "notes") {
      Alert.alert(
        "Xác nhận xóa",
        `Bạn có chắc chắn muốn chuyển ghi chú "${note.title}" vào thùng rác?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Chuyển vào thùng rác",
            style: "destructive",
            onPress: () => {
              softDeleteNote(note.id);
              loadNotes();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Xác nhận xóa vĩnh viễn",
        `Bạn có chắc chắn muốn xóa ghi chú "${note.title}" vĩnh viễn?`,
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa vĩnh viễn",
            style: "destructive",
            onPress: () => {
              permanentDeleteNote(note.id);
              loadNotes();
            },
          },
        ]
      );
    }
  };

  const handleRestore = (note: Note) => {
    restoreNote(note.id);
    loadNotes();
  };

  // Đồng bộ ghi chú lên API (Câu 9)
  const handleSync = async () => {
    try {
      const notesToSync = getAllNotes();
      if (notesToSync.length === 0) {
        Alert.alert("Thông báo", "Không có ghi chú để đồng bộ.");
        return;
      }
      const response = await fetch(apiLink, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notesToSync),
      });
      if (response.ok) {
        Alert.alert(
          "Đồng bộ thành công",
          `Đã gửi ${notesToSync.length} ghi chú lên server.`
        );
      } else {
        Alert.alert("Lỗi", "Không thể đồng bộ. Kiểm tra link API.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đồng bộ ghi chú.");
      console.error(error);
    }
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <NoteItem
      note={item}
      onPress={() => handleNotePress(item)}
      onLongPress={() =>
        activeTab === "notes"
          ? handleDeleteConfirmation(item)
          : Alert.alert("Tùy chọn", `Bạn muốn làm gì với "${item.title}"?`, [
              { text: "Hủy", style: "cancel" },
              { text: "Khôi phục", onPress: () => handleRestore(item) },
              {
                text: "Xóa vĩnh viễn",
                style: "destructive",
                onPress: () => handleDeleteConfirmation(item),
              },
            ])
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeTab === "notes" ? "Note App" : "Thùng rác"}
        </Text>
        <Text style={styles.headerSubtitle}>{notes.length} ghi chú</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={
            activeTab === "notes"
              ? "Tìm kiếm trong ghi chú..."
              : "Tìm kiếm trong thùng rác..."
          }
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notes List với Pull to Refresh */}
      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {activeTab === "notes" ? "📝" : "🗑️"}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "Không tìm thấy ghi chú"
                : activeTab === "notes"
                ? "Chưa có ghi chú nào"
                : "Thùng rác trống"}
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      {activeTab === "notes" && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddScreen(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "notes" && styles.navItemActive,
          ]}
          onPress={() => handleTabChange("notes")}
        >
          <Text style={styles.navIcon}>📝</Text>
          <Text
            style={[
              styles.navText,
              activeTab === "notes" && styles.navTextActive,
            ]}
          >
            Ghi chú
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            activeTab === "trash" && styles.navItemActive,
          ]}
          onPress={() => handleTabChange("trash")}
        >
          <Text style={styles.navIcon}>🗑️</Text>
          <Text
            style={[
              styles.navText,
              activeTab === "trash" && styles.navTextActive,
            ]}
          >
            Thùng rác
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleSync}>
          <Text style={styles.navIcon}>🔄</Text>
          <Text style={styles.navText}>Đồng bộ</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <Modal visible={showAddScreen} animationType="slide">
        <AddNoteScreen
          navigation={{ goBack: () => setShowAddScreen(false) }}
          onNoteAdded={handleNoteAdded}
        />
      </Modal>

      <Modal visible={showEditScreen} animationType="slide">
        {selectedNote && (
          <EditNoteScreen
            navigation={{ goBack: () => setShowEditScreen(false) }}
            note={selectedNote}
            onNoteUpdated={handleNoteUpdated}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

// Styles giữ nguyên
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { backgroundColor: "#6200EE", padding: 20, paddingBottom: 16 },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 14, color: "#E0E0E0" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: 15,
    marginBottom: 10,
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { fontSize: 18, marginRight: 10 },
  searchInput: { flex: 1, padding: 12, fontSize: 16, color: "#333" },
  clearIcon: { fontSize: 20, color: "#999", padding: 5 },
  listContainer: { padding: 15, paddingBottom: 100 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
    marginBottom: 8,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: "#6200EE",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6200EE",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 36,
    color: "#FFF",
    fontWeight: "300",
    marginTop: -2,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    paddingBottom: 5,
  },
  navItem: { flex: 1, paddingVertical: 10, alignItems: "center" },
  navItemActive: { borderTopWidth: 2, borderTopColor: "#6200EE" },
  navIcon: { fontSize: 20 },
  navText: { fontSize: 11, color: "#999", fontWeight: "500" },
  navTextActive: { color: "#6200EE", fontWeight: "600" },
});
