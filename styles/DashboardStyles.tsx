import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 6,
    padding: 10,
    backgroundColor: "#202123",
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  recentChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  newChatText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Raleway",
  },
  recentChatText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Raleway",
  },
  iconRight: {
    marginLeft: 10,
  },
  iconDots: {
    marginLeft: 10,
  },
  /* Overlay que cubre toda la pantalla */
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  /* Dropdown para editar y borrar */
  dropdown: {
    position: "absolute",
    top: 75,
    right: 40,
    backgroundColor: "#343541",
    borderRadius: 5,
    padding: 10,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
    fontFamily: "Raleway",
  },
  bottomSection: {
    width: "100%",
    height: 316,
    position: "absolute",
    top: 450,
    backgroundColor: "#202123",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 12,
    paddingLeft: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    height: 52,
    backgroundColor: "#303134",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10, // Espacio entre el ícono y el texto
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Raleway",
  },
  redText: {
    color: "#ED8C8C",
    fontSize: 16,
    fontFamily: "Raleway",
  },
  lastButton: {
    marginBottom: 0,
    width: "100%",
    backgroundColor: "#303134",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "flex-start",
  },
});
