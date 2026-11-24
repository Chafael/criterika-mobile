import { Text } from 'react-native';

import { LegalHelpBox, LegalScreen } from '@/components/legal/legal-screen';
import { useLegalDocument } from '@/data/legal';
import { authColors, authTypography } from '@/theme';

/** "17c. Aviso de privacidad" (Figma 51:1164) with the full document. */
export default function AvisoPrivacidad() {
  const document = useLegalDocument('privacy');

  return (
    <LegalScreen
      title="Aviso de privacidad"
      document={document}
      initiallyOpen="all"
      beforeSections={
        <LegalHelpBox gap={6}>
          <Text style={[authTypography.legalHeading, { color: authColors.termsText }]}>
            Contacto
          </Text>
          <Text style={[authTypography.legalHelpStrong, { color: authColors.linkStrong }]}>
            Datos personales y derechos ARCO: privacidad@criterika.com
          </Text>
          <Text style={[authTypography.legalHelp, { color: authColors.privacyText }]}>
            Soporte y revisión de suspensiones: soporte@criterika.com
          </Text>
        </LegalHelpBox>
      }
    />
  );
}
