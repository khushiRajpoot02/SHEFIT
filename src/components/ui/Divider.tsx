import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colours, fontSizes, fontWeights, spacing } from '../../theme';

interface DividerProps {
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({ label }) => {
  if (!label) {
    return <View style={styles.line} />;
  }

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[5],
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colours.border,
  },
  label: {
    marginHorizontal: spacing[3],
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semiBold,
    color: colours.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
