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
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },

  instruction: {
    fontSize: theme.fontSize.normal,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    fontWeight: '600',
  },

  telefonoText: {
    fontSize: theme.fontSize.small,
    color: '#666',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },

  input: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: theme.colors.success,
    borderRadius: 8,
    padding: theme.spacing(2),
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing(2),
    textAlign: 'left',
    paddingLeft: 70,
    letterSpacing: 15,
  },

  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
    textAlign: 'center',
    fontWeight: '600',
  },

  intentosInfo: {
    fontSize: theme.fontSize.small,
    color: '#FF9800',
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    fontWeight: '600',
  },

  buttonsContainer: {
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

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    width: '100%',
    paddingVertical: theme.spacing(2),
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.normal,
    fontWeight: 'bold',
  },

  errorTextCustom: {
    color: theme.colors.error, 
    fontSize: theme.fontSize.small,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});