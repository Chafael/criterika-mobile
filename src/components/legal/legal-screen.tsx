import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreen } from '@/components/auth/auth-screen';
import { BackButton } from '@/components/auth/back-button';
import type { LegalDocument } from '@/data/legal';
import { authColors, authTypography, radii } from '@/theme';

import { LegalSectionCard } from './legal-section-card';

type LegalScreenProps = {
  /** Short title in the top bar (70:1216, 51:1171). */
  title: string;
  /** `null` while the document loads. */
  document: LegalDocument | null;
  /** Sections open on arrival: the first one (70:1209) or all (51:1164). */
  initiallyOpen: 'first' | 'all';
  /** Box between the introduction and the sections (70:1157). */
  beforeSections?: ReactNode;
  /** Box after the last section (70:1379). */
  afterSections?: ReactNode;
};

function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

/**
 * Legal document screen (17d 70:1209, 17c 51:1164). Shows the document text
 * as it comes, from its title to the end; nothing here rewrites it.
 * Opened from "Crear cuenta" without a session and, later, from "Perfil".
 */
export function LegalScreen({
  title,
  document,
  initiallyOpen,
  beforeSections,
  afterSections,
}: LegalScreenProps) {
  /** Sections the reader opened or closed, compared with how they started. */
  const [toggled, setToggled] = useState<ReadonlySet<number>>(new Set());

  const isOpen = (index: number) => (initiallyOpen === 'all' || index === 0) !== toggled.has(index);

  const toggle = (index: number) =>
    setToggled((current) => {
      const next = new Set(current);
      if (!next.delete(index)) {
        next.add(index);
      }
      return next;
    });

  return (
    <AuthScreen>
      <View style={styles.topBar}>
        <BackButton accessibilityLabel="Volver atrás" surface="card" onPress={goBack} />
        <Text
          accessibilityRole="header"
          style={[authTypography.legalTitle, { color: authColors.textPrimary }]}>
          {title}
        </Text>
      </View>

      {document ? (
        <View style={styles.content}>
          <Text style={[authTypography.legalHeading, { color: authColors.termsText }]}>
            {document.title}
          </Text>
          <Text style={[authTypography.legalMeta, { color: authColors.privacyText }]}>
            {document.lastUpdated}
          </Text>
          {document.intro.map((paragraph, index) => (
            <Text key={index} style={[authTypography.legalBody, { color: authColors.termsText }]}>
              {paragraph}
            </Text>
          ))}
          {beforeSections}
          {document.sections.map((section, index) => (
            <LegalSectionCard
              key={section.title}
              section={section}
              expanded={isOpen(index)}
              onToggle={() => toggle(index)}
            />
          ))}
          {afterSections}
        </View>
      ) : null}
    </AuthScreen>
  );
}

type LegalHelpBoxProps = {
  /** 4 px in 70:1379, 6 px in 70:1157. */
  gap: 4 | 6;
  children: ReactNode;
};

/** Cream box for help and contact lines (70:1379, 70:1157). */
export function LegalHelpBox({ gap, children }: LegalHelpBoxProps) {
  return <View style={[styles.help, { gap }]}>{children}</View>;
}

const styles = StyleSheet.create({
  /** Back button and title (70:1212) with its 8 px margin (70:1211). */
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  /** "Contenido legal" (70:1299). */
  content: { gap: 12 },
  help: { padding: 16, borderRadius: radii.lg, backgroundColor: authColors.surfaceHelp },
});
