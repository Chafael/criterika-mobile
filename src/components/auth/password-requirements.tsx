import { StyleSheet, Text, View } from 'react-native';

import { passwordRequirements, type PasswordRequirement } from '@/data/access-rules';
import { icons } from '@/media';
import { authColors, typography } from '@/theme';

type PasswordRequirementsProps = {
  password: string;
  requirements?: readonly PasswordRequirement[];
};

/**
 * Live security checklist under the password (47:1110, 1:339).
 * Figma only draws the empty state ("0 de 4"); a met requirement swaps the
 * empty circle for the filled check (1:468) in the success green, and the bar
 * fills with the same green as the unit progress (1:446).
 */
export function PasswordRequirements({
  password,
  requirements = passwordRequirements,
}: PasswordRequirementsProps) {
  const met = requirements.filter((requirement) => requirement.isMet(password)).length;
  const total = requirements.length;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={[typography.caption, { color: authColors.textSecondary }]}>
          Requisitos de seguridad:
        </Text>
        <Text
          accessibilityLabel={`${met} de ${total} requisitos cumplidos`}
          style={[typography.caption, { color: authColors.textMuted }]}>
          {met} de {total}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(met / total) * 100}%` }]} />
      </View>
      <View style={styles.list}>
        {requirements.map((requirement) => {
          const done = requirement.isMet(password);
          return (
            <View
              key={requirement.id}
              accessible
              accessibilityLabel={`${requirement.label}: ${done ? 'cumplido' : 'pendiente'}`}
              style={styles.item}>
              {done ? (
                <icons.check width={13.333} height={13.333} color={authColors.success} />
              ) : (
                <icons.requirementPending
                  width={13.333}
                  height={13.333}
                  color={authColors.iconMuted}
                />
              )}
              <Text style={[typography.body, { color: authColors.textMuted }]}>
                {requirement.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    gap: 6,
    padding: 8,
    borderRadius: 8,
    backgroundColor: authColors.surfaceRequirements,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    height: 6,
    borderRadius: 9999,
    backgroundColor: authColors.track,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 9999,
    backgroundColor: authColors.success,
  },
  list: { gap: 4, paddingTop: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
