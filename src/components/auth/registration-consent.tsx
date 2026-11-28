import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/auth/back-button';
import { Checkbox } from '@/components/auth/checkbox';
import type { RegistrationDocument, RegistrationDocuments } from '@/data/registration-api';
import { authColors, authTypography, spacing, typography } from '@/theme';

export type ConsentSelection = { terms: boolean; privacy: boolean; purposes: string[] };

export const emptyConsent: ConsentSelection = { terms: false, privacy: false, purposes: [] };

type DocumentKey = keyof RegistrationDocuments;

const documentTitles: Record<DocumentKey, string> = {
  terminos: 'Términos y condiciones',
  avisoPrivacidad: 'Aviso de privacidad',
};

function ConsentControl({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={onToggle}
      style={styles.check}>
      <Checkbox checked={checked} />
      <Text style={[authTypography.terms, styles.checkText]}>{label}</Text>
    </Pressable>
  );
}

function DocumentViewer({
  title,
  document,
  onClose,
}: {
  title: string;
  document: RegistrationDocument;
  onClose: () => void;
}) {
  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.viewer}>
        <View style={styles.viewerHeader}>
          <BackButton accessibilityLabel="Cerrar documento" surface="card" onPress={onClose} />
          <Text accessibilityRole="header" style={[typography.title, styles.checkText]}>
            {title}
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.viewerContent}>
          <Text style={[typography.captionBold, styles.body]}>Versión {document.version}</Text>
          {document.contenidoMarkdown.split(/\r?\n/).map((line, index) => {
            if (!line.trim()) return null;
            const heading = /^#{1,6}\s+/.test(line);
            const copy = line
              .replace(/^#{1,6}\s+/, '')
              .replace(/^\s*[-*]\s+/, '• ')
              .replace(/\*\*([^*]+)\*\*/g, '$1');
            return (
              <Text
                key={index}
                selectable
                accessibilityRole={heading ? 'header' : undefined}
                style={
                  heading
                    ? [typography.label, styles.heading]
                    : [authTypography.bodyRelaxed, styles.body]
                }>
                {copy}
              </Text>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export function RegistrationConsent({
  documents,
  selection,
  onChange,
}: {
  documents: RegistrationDocuments;
  selection: ConsentSelection;
  onChange: (selection: ConsentSelection) => void;
}) {
  const [open, setOpen] = useState<DocumentKey | null>(null);
  return (
    <View style={styles.controls}>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen('terminos')}
        style={styles.documentLink}>
        <Text style={[authTypography.termsLink, styles.link]}>Leer Términos y condiciones</Text>
      </Pressable>
      <ConsentControl
        label="Acepto los Términos y condiciones de Criterika"
        checked={selection.terms}
        onToggle={() => onChange({ ...selection, terms: !selection.terms })}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen('avisoPrivacidad')}
        style={styles.documentLink}>
        <Text style={[authTypography.termsLink, styles.link]}>Leer Aviso de privacidad</Text>
      </Pressable>
      <ConsentControl
        label="Reconozco que se presentó el Aviso de privacidad"
        checked={selection.privacy}
        onToggle={() => onChange({ ...selection, privacy: !selection.privacy })}
      />
      {documents.avisoPrivacidad.finalidades.map((purpose) => {
        const checked = selection.purposes.includes(purpose.id);
        return (
          <ConsentControl
            key={purpose.id}
            label={`Consiento: ${purpose.descripcion}${purpose.necesaria ? ' (necesaria)' : ''}`}
            checked={checked}
            onToggle={() =>
              onChange({
                ...selection,
                purposes: checked
                  ? selection.purposes.filter((id) => id !== purpose.id)
                  : [...selection.purposes, purpose.id],
              })
            }
          />
        );
      })}
      {open ? (
        <DocumentViewer
          title={documentTitles[open]}
          document={documents[open]}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  controls: { gap: 4 },
  documentLink: { minHeight: 44, justifyContent: 'center' },
  link: { color: authColors.linkStrong, textDecorationLine: 'underline' },
  check: { flexDirection: 'row', minHeight: 44, gap: 10, alignItems: 'center' },
  checkText: { flex: 1, color: authColors.termsText },
  viewer: { flex: 1, backgroundColor: authColors.background },
  viewerHeader: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.screen,
  },
  viewerContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: spacing.screen,
    gap: 8,
  },
  body: { color: authColors.textSecondary },
  heading: { color: authColors.textPrimary, marginTop: 8 },
});
