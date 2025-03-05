import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#343541",
    borderTopWidth: 1,
    borderColor: "#ccc",
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
    backgroundColor: "#10A37F",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
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
    color: "white",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  sendButton: {
    width: 52,
    height: 52,
    backgroundColor: "#10A37F",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIndicator: {
    marginVertical: 10,
  },
});
