import { StyleSheet } from "react-native";
import theme from "@/theme/Theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: "bold",
    marginBottom: theme.spacing(3),
    textAlign: "center",
    color: theme.colors.primary,
  },

  infoBox: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
    width: "100%",
  },

  infoLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing(0.5),
  },

  infoValue: {
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    color: theme.colors.secondary,
  },

  inputGroup: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },

  label: {
    fontSize: theme.fontSize.normal,
    fontWeight: "600",
    marginBottom: theme.spacing(1),
    color: theme.colors.primary,
  },

  input: {
    width: "100%",
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(1.5),
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: theme.spacing(1),
  },

  counter: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },

  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
    textAlign: "center",
  },

  botonesContainer: {
    width: "100%",
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
    alignItems: "center",
  },

  button: {
    backgroundColor: theme.colors.secondary,
    width: "80%",
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonVolver: {
    backgroundColor: theme.colors.error,
  },

  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
  },
});