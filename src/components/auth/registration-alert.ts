import type { AlertContent } from '@/components/alert/alert-card';
import { RegistrationError } from '@/data/registration-api';

export function registrationAlert(error: unknown): AlertContent {
  const code = error instanceof RegistrationError ? error.code : undefined;
  switch (code) {
    case 'CODE_INVALID':
      return {
        tone: 'danger',
        title: 'El código es incorrecto',
        message: 'Revisa los seis dígitos del correo e inténtalo otra vez.',
      };
    case 'CODE_EXPIRED':
      return {
        tone: 'danger',
        title: 'El código venció',
        message: 'Pide uno nuevo con Reenviar código.',
      };
    case 'RATE_LIMITED':
      return {
        tone: 'danger',
        title: 'Espera un momento',
        message: 'Podrás intentarlo de nuevo cuando termine el tiempo de espera.',
      };
    case 'RESOURCE_NOT_FOUND':
    case 'STATE_CONFLICT':
      return {
        tone: 'danger',
        title: 'La solicitud ya no está disponible',
        message: 'Vuelve a Crear cuenta para iniciar de nuevo.',
      };
    case 'LEGAL_VERSION_OUTDATED':
      return {
        tone: 'danger',
        title: 'Los documentos se actualizaron',
        message: 'Consulta y acepta las versiones vigentes para continuar.',
      };
    case 'VALIDATION_FAILED':
      return {
        tone: 'danger',
        title: 'Revisa los datos del registro',
        message: 'Comprueba tus datos y las opciones de aceptación.',
      };
    default:
      return {
        tone: 'danger',
        title: 'No pudimos completar la solicitud',
        message: 'Comprueba tu conexión e inténtalo de nuevo.',
      };
  }
}
