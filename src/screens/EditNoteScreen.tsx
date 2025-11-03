import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// --- THAY ĐỔI (CÂU 4) ---
import { updateNote } from "../database/db";
import { Note } from "./HomeScreen"; // Import interface 'Note' từ HomeScreen

interface EditNoteScreenProps {
  navigation: any;
  onNoteUpdated: () => void;
  note: Note; // Note cần sửa
}

export default function EditNoteScreen({
  navigation,
  onNoteUpdated,
  note,
}: EditNoteScreenProps) {
  // --- THAY ĐỔI (CÂU 4) ---
  // State được khởi tạo bằng dữ liệu của note cũ
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // Cập nhật state nếu prop 'note' thay đổi (mặc dù ở đây ít khi xảy ra)
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  // --- THAY ĐỔI (CÂU 4) ---
  // Đổi tên hàm từ handleAddNote thành handleSaveNote
  const handleSaveNote = () => {
    // Vẫn giữ validation
    if (title.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề");
      return;
    }
    if (content.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung");
      return;
    }

    // Gọi hàm updateNote (Câu 4b)
    const success = updateNote(note.id, title.trim(), content.trim());

    if (success) {
      Alert.alert("Thành công", "Đã cập nhật ghi chú", [
        {
          text: "OK",
          onPress: () => {
            onNoteUpdated(); // Báo cho HomeScreen load lại
            navigation.goBack(); // Đóng Modal
          },
        },
      ]);
    } else {
      Alert.alert("Lỗi", "Không thể cập nhật ghi chú");
    }
  };

  const handleCancel = () => {
    // Kiểm tra xem có thay đổi so với bản gốc không
    if (title.trim() !== note.title || content.trim() !== note.content) {
      Alert.alert(
        "Xác nhận",
        "Bạn có chắc muốn hủy? Thay đổi chưa lưu sẽ bị mất.",
        [
          { text: "Tiếp tục sửa", style: "cancel" },
          {
            text: "Hủy",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6200EE" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>← Hủy</Text>
        </TouchableOpacity>
        {/* --- THAY ĐỔI (CÂU 4) --- */}
        <Text style={styles.headerTitle}>Sửa Ghi Chú</Text>
        <TouchableOpacity onPress={handleSaveNote} style={styles.headerButton}>
          {/* --- THAY ĐỔI (CÂU 4) --- */}
          <Text style={styles.headerButtonTextSave}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
              ref={titleInputRef}
              style={styles.titleInput}
              placeholder="Nhập tiêu đề ghi chú..."
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Content Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nội dung</Text>
            <TextInput
              ref={contentInputRef}
              style={styles.contentInput}
              placeholder="Nhập nội dung ghi chú..."
              placeholderTextColor="#999"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <Text style={styles.charCount}>{content.length}/5000</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            // Vẫn giữ logic disabled
            (title.trim() === "" || content.trim() === "") &&
              styles.addButtonDisabled,
          ]}
          onPress={handleSaveNote}
          disabled={title.trim() === "" || content.trim() === ""}
        >
          {/* --- THAY ĐỔI (CÂU 4) --- */}
          <Text style={styles.addButtonText}>✓ Lưu Thay Đổi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// (Styles y hệt AddNoteScreen, chỉ copy và paste)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6200EE",
    padding: 15,
  },
  headerButton: {
    padding: 5,
    minWidth: 60,
  },
  headerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  headerButtonTextSave: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  contentInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    minHeight: 200,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  addButton: {
    backgroundColor: "#6200EE",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#6200EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonDisabled: {
    backgroundColor: "#CCCCCC",
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
