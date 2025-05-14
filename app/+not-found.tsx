import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Màn này không tồn tại.</Text>
        <Text style={styles.description}>Có vẻ như bạn đã truy cập vào một đường dẫn không hợp lệ.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Hãy quay về màn hình trang chủ!</Text>
        </Link>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => Alert.alert("Quay lại", "Chức năng quay lại sẽ được triển khai.")}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
  },
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2e78b7",
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
