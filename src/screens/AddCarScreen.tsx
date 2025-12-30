import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { createCar } from '../services/api';

type AddCarScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AddCar'
>;

export const AddCarScreen: React.FC = () => {
  const navigation = useNavigation<AddCarScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [carName, setCarName] = useState('');
  const [description, setDescription] = useState('');
  const [carType, setCarType] = useState<'automatic' | 'manual' | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [showCarTypeDropdown, setShowCarTypeDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [tagsFocused, setTagsFocused] = useState(false);
  const [errors, setErrors] = useState<{
    carName?: string;
    carType?: string;
    tags?: string;
    imageUrl?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'Engine: 5.0L Ti-VCT V8',
    'Displacement: 4951 cc',
    'Fuel Type: Petrol',
    'Mileage (ARAI): 7.9 km/l',
    'Top Speed: 250 km/h',
    'Max Power: 401 PS @ 6500 rpm',
    'Emission Standard: BS4',
  ];

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!carName.trim()) {
      newErrors.carName = 'Mandatory!';
    }

    if (!carType) {
      newErrors.carType = 'Mandatory!';
    }

    if (tags.length === 0) {
      newErrors.tags = 'Mandatory!';
    }

    if (!imageUrl.trim()) {
      newErrors.imageUrl = 'Mandatory!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCar = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const carData = {
        name: carName.trim(),
        description: description.trim(),
        carType: carType as 'automatic' | 'manual',
        imageUrl: imageUrl.trim(),
        tags: tags,
      };
      console.log('Adding car with data:', carData);
      const newCar = await createCar(carData);
      console.log('Car added successfully:', newCar);
      // Navigate back after successful creation
      navigation.goBack();
    } catch (error) {
      console.error('Error adding car:', error);
      // You can show an error toast here
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to add car. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Image
              source={require('../Assest/back.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.title}>Add Car</Text>
        </View>

        {/* Car Name Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Car name<Text style={styles.required}>*</Text>
            </Text>
            {errors.carName && (
              <Text style={styles.errorText}>{errors.carName}</Text>
            )}
          </View>
          <TextInput
            style={[
              styles.input,
              errors.carName && styles.inputError,
            ]}
            placeholder="Enter car name"
            placeholderTextColor="#999"
            value={carName}
            onChangeText={(text) => {
              setCarName(text);
              if (errors.carName && text.trim()) {
                setErrors({ ...errors, carName: undefined });
              }
            }}
          />
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.charCounter}>
              {description.length}/250 char
            </Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter here"
            placeholderTextColor="#999"
            value={description}
            onChangeText={(text) => {
              if (text.length <= 250) {
                setDescription(text);
              }
            }}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Car Type Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Car type<Text style={styles.required}>*</Text>
            </Text>
            {errors.carType && (
              <Text style={styles.errorText}>{errors.carType}</Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.dropdown,
              errors.carType && styles.dropdownError,
            ]}
            onPress={() => {
              setShowCarTypeDropdown(!showCarTypeDropdown);
              if (errors.carType && carType) {
                setErrors({ ...errors, carType: undefined });
              }
            }}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.dropdownText,
                !carType && styles.dropdownPlaceholder,
              ]}>
              {carType ? carType.charAt(0).toUpperCase() + carType.slice(1) : 'Select'}
            </Text>
            <Text style={styles.dropdownIcon}>
              {showCarTypeDropdown ? '⌃' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {/* Car Type Dropdown Options */}
          {showCarTypeDropdown && (
            <View
              style={styles.dropdownOptions}
              onStartShouldSetResponder={() => true}>
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => {
                  setCarType('manual');
                  setShowCarTypeDropdown(false);
                }}
                activeOpacity={0.7}>
                <View style={styles.radioButton}>
                  {carType === 'manual' && (
                    <View style={styles.radioButtonSelected}>
                      <Text style={styles.radioCheckmark}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.radioLabel}>Manual</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => {
                  setCarType('automatic');
                  setShowCarTypeDropdown(false);
                }}
                activeOpacity={0.7}>
                <View style={styles.radioButton}>
                  {carType === 'automatic' && (
                    <View style={styles.radioButtonSelected}>
                      <Text style={styles.radioCheckmark}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.radioLabel}>Automatic</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tags Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Tags<Text style={styles.required}>*</Text>
            </Text>
            {errors.tags && (
              <Text style={styles.errorText}>{errors.tags}</Text>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.tagsInput,
              (tagsFocused || showTagsDropdown) && styles.tagsInputFocused,
              errors.tags && styles.tagsInputError,
            ]}
            onPress={() => {
              setShowTagsDropdown(!showTagsDropdown);
              setTagsFocused(true);
              if (errors.tags && tags.length > 0) {
                setErrors({ ...errors, tags: undefined });
              }
            }}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.dropdownText,
                styles.dropdownPlaceholder,
              ]}>
              Select
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          
          {/* Selected Tags Display - Below the input field */}
          {tags.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => removeTag(tag)}
                    style={styles.tagRemoveButton}
                    activeOpacity={0.7}>
                    <Text style={styles.tagRemoveIcon}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
          
          {/* Tags Dropdown Options - Below selected tags */}
          {showTagsDropdown && (
            <View
              style={styles.tagsDropdownOptions}
              onStartShouldSetResponder={() => true}>
              {availableTags
                .filter((tag) => !tags.includes(tag))
                .map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.tagOption}
                    onPress={() => {
                      toggleTag(tag);
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.tagOptionText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>

        {/* Car Image URL Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>
              Car Image URL<Text style={styles.required}>*</Text>
            </Text>
            {errors.imageUrl && (
              <Text style={styles.errorText}>{errors.imageUrl}</Text>
            )}
          </View>
          <TextInput
            style={[
              styles.input,
              errors.imageUrl && styles.inputError,
            ]}
            placeholder="Enter here"
            placeholderTextColor="#999"
            value={imageUrl}
            onChangeText={(text) => {
              setImageUrl(text);
              if (errors.imageUrl && text.trim()) {
                setErrors({ ...errors, imageUrl: undefined });
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
          onPress={handleAddCar}
          activeOpacity={0.8}
          disabled={isSubmitting}>
          <Text style={styles.addButtonText}>
            {isSubmitting ? 'Adding...' : 'Add'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  required: {
    color: '#FF0000',
  },
  errorText: {
    fontSize: 12,
    color: '#FF0000',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inputError: {
    borderColor: '#FF0000',
    borderWidth: 1.5,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCounter: {
    fontSize: 12,
    color: '#999',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownError: {
    borderColor: '#FF0000',
    borderWidth: 1.5,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioButtonSelected: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  radioCheckmark: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  radioLabel: {
    fontSize: 14,
    color: '#000',
  },
  tagsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  tagsInputFocused: {
    borderWidth: 2,
    borderColor: '#A855F7',
  },
  tagsInputError: {
    borderColor: '#FF0000',
    borderWidth: 1.5,
  },
  tagsInputInner: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    minHeight: 32,
    justifyContent: 'center',
  },
  tagsInputInnerFocused: {
    borderColor: '#A855F7',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9D5FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipText: {
    fontSize: 14,
    color: '#000',
    marginRight: 6,
  },
  tagRemoveButton: {
    padding: 2,
  },
  tagRemoveIcon: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  tagsDropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  tagOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tagOptionText: {
    fontSize: 14,
    color: '#000',
  },
  addButton: {
    backgroundColor: '#A855F7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  tagsModalScroll: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  modalOptionSelected: {
    backgroundColor: '#E9D5FF',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#000',
  },
  modalOptionTextSelected: {
    color: '#A855F7',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: '#A855F7',
    fontWeight: 'bold',
  },
  modalCancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    color: '#A855F7',
    fontWeight: '600',
  },
});

