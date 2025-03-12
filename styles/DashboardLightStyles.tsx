import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // fondo claro general
  },
  topSection: {
    flex: 6,
    padding: 10,
    backgroundColor: "#ffffff", // fondo blanco para la sección superior
    paddingTop: 50,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd", // borde más claro
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
    color: "#333", // texto oscuro para contraste
    fontFamily: "Raleway",
  },
  recentChatText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "rgba(0,0,0,0.05)", // overlay muy sutil
    zIndex: 1000,
  },
  /* Dropdown para editar y borrar */
  dropdown: {
    position: "absolute",
    top: 75,
    right: 40,
    backgroundColor: "#ffffff", // fondo blanco para el dropdown
    borderRadius: 5,
    padding: 10,
    zIndex: 1000,
    shadowColor: "#aaa",
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
    color: "#333", // texto oscuro
    fontFamily: "Raleway",
  },
  bottomSection: {
    width: "100%",
    height: 316,
    position: "absolute",
    top: 550,
    backgroundColor: "#ffffff", // fondo blanco para sección inferior
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 12,
    paddingLeft: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 52,
    backgroundColor: "#e0e0e0", // fondo gris claro
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
    color: "#333", // texto oscuro
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
    backgroundColor: "#e0e0e0",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)", // overlay un poco más suave
  },
  modalContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5, // sombra en Android
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  loadingContainer: {
    position: "absolute",
    zIndex: 10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)", // fondo claro y translúcido
  },
});
