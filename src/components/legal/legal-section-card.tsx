import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { LegalSection } from '@/data/legal';
import { icons } from '@/media';
import { authColors, authTypography, radii } from '@/theme';

type LegalSectionCardProps = {
  section: LegalSection;
  expanded: boolean;
  onToggle: () => void;
};

/**
 * "Apartado" of a legal document (70:1302 open, 70:1309 closed). The whole
 * header opens and closes it; the chevron points up while it is open.
 */
export function LegalSectionCard({ section, expanded, onToggle }: LegalSectionCardProps) {
  const Chevron = expanded ? icons.chevronUp : icons.chevronDown;

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={section.title}
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={[styles.header, expanded && styles.headerExpanded]}>
        <Text style={[authTypography.legalHeading, styles.title]}>{section.title}</Text>
        <Chevron width={12} height={12} color={authColors.privacyText} />
      </Pressable>
      {expanded ? (
        <View style={styles.body}>
          {section.paragraphs.map((paragraph, index) => (
            <Text key={index} style={[authTypography.legalBody, styles.paragraph]}>
              {paragraph}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** 16 px padding and 6 px gap of the card, split between header and body. */
const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: authColors.sectionBorder,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: authColors.surfaceRaised,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 },
  headerExpanded: { paddingBottom: 6 },
  title: { flex: 1, color: authColors.termsText },
  body: { gap: 6, paddingHorizontal: 16, paddingBottom: 16 },
  paragraph: { color: authColors.privacyText },
});
