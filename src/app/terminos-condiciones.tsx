import { Text } from 'react-native';

import { LegalHelpBox, LegalScreen } from '@/components/legal/legal-screen';
import { useLegalDocument } from '@/data/legal';
import { authColors, authTypography } from '@/theme';

/** "17d. Términos y condiciones" (Figma 70:1209) with the full document. */
export default function TerminosCondiciones() {
  const document = useLegalDocument('terms');

  return (
    <LegalScreen
      title="Términos y condiciones"
      document={document}
      initiallyOpen="first"
      afterSections={
        <LegalHelpBox gap={4}>
          <Text style={[authTypography.legalHeading, { color: authColors.termsText }]}>
            ¿Dudas sobre estas condiciones?
          </Text>
          <Text style={[authTypography.legalHelpStrong, { color: authColors.linkStrong }]}>
            Escríbenos a soporte@criterika.com
          </Text>
        </LegalHelpBox>
      }
    />
  );
}
