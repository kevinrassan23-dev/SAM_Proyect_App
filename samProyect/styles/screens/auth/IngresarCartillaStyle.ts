import { StyleSheet } from 'react-native';
import theme from '@/theme/Theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  title: {
    fontSize: theme.fontSize.title,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },

  input: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(2),
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(2),
  },

  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    fontWeight: '600',
  },

  // ✅ NUEVO: Texto para intentos restantes
  intentosText: {
    color: '#FF9800',
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    fontWeight: '600',
  },

  // ✅ NUEVO: Texto para bloqueo
  bloqueoText: {
    color: '#FF5252',
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    fontWeight: '600',
  },

  VerificacionMovilContainer: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },

  button: {
    backgroundColor: theme.colors.secondary,
    width: '100%',
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  timerText: {
    color: theme.colors.error, // Rojo según tu tema
    fontSize: theme.fontSize.normal,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
});