import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5", // Fondo claro
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "lightgrey",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 25,
  },
  messageTime: {
    fontSize: 10,
    color: "gray",
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 52,
    color: "#000",
    backgroundColor: "#ffffff",
  },
  sendButton: {
    width: 52,
    height: 52,
    backgroundColor: "#e0e0e0", // Botón con fondo claro
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    marginVertical: 10,
  },
});
