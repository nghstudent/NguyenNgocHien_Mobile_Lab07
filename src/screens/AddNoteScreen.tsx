import React, { useRef, useState } from "react";
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
import { addNote } from "../database/db";

interface AddNoteScreenProps {
  navigation: any;
  onNoteAdded: () => void;
}

export default function AddNoteScreen({
  navigation,
  onNoteAdded,
}: AddNoteScreenProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  const handleAddNote = () => {
    // --- ĐÃ SỬA: ---
    // Tôi đã comment (vô hiệu hóa) 2 đoạn kiểm tra (validation) này.
    // Giờ đây bạn có thể thêm cả ghi chú rỗng.
    /*
if (title.trim() === '') {
Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề');
return;
}

if (content.trim() === '') {
Alert.alert('Lỗi', 'Vui lòng nhập nội dung');
return;
}
*/

    // Thêm vào database (có thể thêm title/content rỗng)
    const noteId = addNote(title.trim(), content.trim());

    if (noteId) {
      Alert.alert("Thành công", "Đã thêm ghi chú mới", [
        {
          text: "OK",
          onPress: () => {
            setTitle("");
            setContent("");
            titleInputRef.current?.clear();
            contentInputRef.current?.clear();
            onNoteAdded();
            navigation.goBack();
          },
        },
      ]);
    } else {
      Alert.alert("Lỗi", "Không thể thêm ghi chú");
    }
  };

  const handleCancel = () => {
    // ... (phần này giữ nguyên, không cần sửa)
    if (title.trim() !== "" || content.trim() !== "") {
      Alert.alert(
        "Xác nhận",
        "Bạn có chắc muốn hủy? Nội dung chưa lưu sẽ bị mất.",
        [
          { text: "Tiếp tục viết", style: "cancel" },
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
        <Text style={styles.headerTitle}>Thêm Ghi Chú</Text>
        <TouchableOpacity onPress={handleAddNote} style={styles.headerButton}>
          <Text style={styles.headerButtonTextSave}>Add</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.formContainer}>
          {/* ... (Phần input Tiêu đề và Nội dung giữ nguyên, không cần sửa) ... */}
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

      {/* Add Button - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            // --- ĐÃ SỬA: ---
            // Tôi đã xóa dòng điều kiện 'styles.addButtonDisabled' ở đây
          ]}
          onPress={handleAddNote}
          // --- ĐÃ SỬA: ---
          // Tôi đã xóa thuộc tính 'disabled' ở đây
        >
          <Text style={styles.addButtonText}>✓ Thêm Ghi Chú</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... (Phần styles giữ nguyên, không cần sửa)
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
