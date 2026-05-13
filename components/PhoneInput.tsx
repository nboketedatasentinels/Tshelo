import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '../constants/countries';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onChangeCountry?: (country: Country) => void;
  selectedCountry?: Country;
};

export function PhoneInput({
  value,
  onChangeText,
  onChangeCountry,
  selectedCountry = DEFAULT_COUNTRY,
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleSelect = (country: Country) => {
    onChangeCountry?.(country);
    setPickerVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Pressable style={styles.dialCode} onPress={() => setPickerVisible(true)}>
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialText}>{selectedCountry.dialCode}</Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Phone number"
          placeholderTextColor={Colors.placeholder}
          keyboardType="phone-pad"
          autoComplete="tel"
          returnKeyType="done"
        />
      </View>

      <Modal visible={pickerVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setPickerVisible(false)}>
          <SafeAreaView style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(c) => c.code}
              renderItem={({ item }) => (
                <Pressable style={styles.countryRow} onPress={() => handleSelect(item)}>
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                  <Text style={styles.dialText}>{item.dialCode}</Text>
                </Pressable>
              )}
            />
          </SafeAreaView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    height: 54,
  },
  dialCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 4,
  },
  flag: {
    fontSize: 20,
  },
  dialText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chevron: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 8,
    maxHeight: 320,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});
