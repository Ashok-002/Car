import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchCarById, CarDetail, deleteCar } from '../services/api';
import { RootStackParamList } from '../navigation/types';

type CarDetailScreenRouteProp = RouteProp<RootStackParamList, 'CarDetail'>;
type CarDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CarDetail'
>;

export const CarDetailScreen: React.FC = () => {
  const route = useRoute<CarDetailScreenRouteProp>();
  const navigation = useNavigation<CarDetailScreenNavigationProp>();
  const { carId } = route.params;
  const [car, setCar] = useState<CarDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (carId) {
      loadCarDetails();
    }
  }, [carId]);

  const loadCarDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchCarById(carId);
      setCar(data);
    } catch (error) {
      console.error('Error loading car details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
    } catch {
      return 'N/A';
    }
  };

  const transmissionColor =
    car?.carType === 'automatic' ? '#D4A574' : '#A8D5BA';
  const transmissionText =
    car?.carType === 'automatic' ? 'Automatic' : 'Manual';
  const transmissionTextColor =
    car?.carType === 'automatic' ? '#000' : '#FFFFFF';

  const handleDelete = async () => {
    if (!car?.id) return;

    try {
      setIsDeleting(true);
      await deleteCar(car.id);
      console.log('Car deleted successfully:', car.id);
      setDeleteModalVisible(false);
      // Navigate back to CarLibraryScreen
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting car:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to delete car. Please try again.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#A855F7" />
          </View>
        ) : car ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

              <Text style={styles.carName}>{car.name}</Text>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: car.imageUrl }}
                  style={styles.carImage}
                  resizeMode="cover"
                />
              </View>

              <View
                style={[
                  styles.transmissionTag,
                  { backgroundColor: transmissionColor },
                ]}>
                <Text
                  style={[
                    styles.transmissionText,
                    { color: transmissionTextColor },
                  ]}>
                  {transmissionText}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>DESCRIPTION</Text>
                <Text style={styles.descriptionText}>{car.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>TAGS</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      Displacement: {car.displacement}
                    </Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      Fuel Type: {car.fuelType}
                    </Text>
                  </View>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>
                      Top Speed: {car.topSpeed}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.lastUpdated}>
                  Last updated: {formatDate(car.lastUpdated)}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => setDeleteModalVisible(true)}
                  activeOpacity={0.7}>
                  <Image
                    source={require('../Assest/Delete.png')}
                    style={styles.deleteIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load car details</Text>
            </View>
          )}
        </View>

        {/* Delete Confirmation Modal - Centered Dialog */}
        <Modal
          visible={deleteModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelDelete}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleCancelDelete}
            />
            <View style={styles.deleteModalContainer}>
              <View style={styles.deleteModalContent}>
                <View style={styles.modalIconContainer}>
                  <Image
                    source={require('../Assest/Delete.png')}
                    style={styles.modalTrashIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.modalTitle}>
                  Delete {car?.name}??
                </Text>
                <Text style={styles.modalMessage}>
                  Are you sure you want to delete this Car?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelDelete}
                    activeOpacity={0.7}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmDeleteButton}
                    onPress={handleDelete}
                    activeOpacity={0.7}
                    disabled={isDeleting}>
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.confirmDeleteButtonText}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: '#666',
    fontWeight: '300',
  },
  carName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  transmissionTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  transmissionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A855F7',
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  deleteModalContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTrashIcon: {
    width: 48,
    height: 48,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  confirmDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    minHeight: 44,
  },
  confirmDeleteButtonDisabled: {
    opacity: 0.6,
  },
  confirmDeleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

