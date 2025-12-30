import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CarCard } from '../components/CarCard';
import { BottomNavigation } from '../components/BottomNavigation';
import { fetchCars, Car } from '../services/api';
import { RootStackParamList } from '../navigation/types';

type CarLibraryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CarLibrary'
>;

export const CarLibraryScreen: React.FC = () => {
  const navigation = useNavigation<CarLibraryScreenNavigationProp>();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<'a-z' | 'date' | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCarTypes, setSelectedCarTypes] = useState<('automatic' | 'manual')[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tempSelectedCarTypes, setTempSelectedCarTypes] = useState<('automatic' | 'manual')[]>([]);
  const [tempSelectedTags, setTempSelectedTags] = useState<string[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  // Available tags for filtering
  const availableTags = [
    'Engine: 5.0L Ti-VCT V8',
    'Displacement: 4951 cc',
    'Fuel Type: Petrol',
    'Mileage (ARAI): 7.9 km/l',
    'Top Speed: 250 km/h',
    'Max Power: 401 PS @ 6500 rpm',
    'Emission Standard: BS4',
  ];

  useEffect(() => {
    loadCars();
  }, []);

  // Refresh cars when screen comes into focus (e.g., after adding a car)
  useFocusEffect(
    useCallback(() => {
      loadCars();
    }, []),
  );

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await fetchCars();
      setCars(data);
      setFilteredCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // If search is empty, update immediately (no debounce needed)
    if (!searchQuery.trim()) {
      setDebouncedSearchQuery('');
      return;
    }

    // Set new timer for non-empty searches
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Filter and sort cars when debounced search query, cars list, sort option, or filters change
  useEffect(() => {
    let filtered = cars;

    // Apply search filter
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = cars.filter((car) =>
        car.name.toLowerCase().includes(query),
      );
    }

    // Apply car type filter
    if (selectedCarTypes.length > 0) {
      filtered = filtered.filter((car) =>
        selectedCarTypes.includes(car.carType),
      );
    }

    // Apply tag filter (simplified - based on car properties)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((car) => {
        // This is a simplified approach - adjust based on actual API data
        return selectedTags.some((tag) => {
          if (tag.includes('Displacement')) {
            return car.name.toLowerCase().includes('mustang') || 
                   car.name.toLowerCase().includes('v8') ||
                   car.name.toLowerCase().includes('gt');
          }
          if (tag.includes('Fuel Type: Petrol')) {
            return true; // Most cars are petrol
          }
          if (tag.includes('Top Speed')) {
            return true; // Most cars have top speed
          }
          return true;
        });
      });
    }

    // Apply sorting
    if (sortOption === 'a-z') {
      filtered = [...filtered].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    } else if (sortOption === 'date') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Most recent first
      });
    }

    setFilteredCars(filtered);
  }, [debouncedSearchQuery, cars, sortOption, selectedCarTypes, selectedTags]);

  const handleCarPress = useCallback(
    (carId: number) => {
      navigation.navigate('CarDetail', { carId });
    },
    [navigation],
  );

  const renderCar = useCallback(
    ({ item }: { item: Car }) => (
      <CarCard car={item} onPress={() => handleCarPress(item.id)} />
    ),
    [handleCarPress],
  );

  const renderHeader = useCallback(() => (
    <View style={styles.header}>
      <View style={styles.topBar}>
        <View style={styles.placeholder} />
        <TouchableOpacity
          style={styles.newCarButton}
          onPress={() => navigation.navigate('AddCar')}
          activeOpacity={0.8}>
          <Text style={styles.newCarButtonText}>+ New Car</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            searchQuery.length > 0 && styles.searchBarActive,
          ]}>
          <Image
            source={require('../Assest/Search.png')}
            style={styles.searchIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="never"
            editable={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              activeOpacity={0.7}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.cancelButton}
            activeOpacity={0.7}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        {searchQuery.length === 0 && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setSortModalVisible(true)}
              activeOpacity={0.7}>
              <Image
                source={require('../Assest/Sort.png')}
                style={[
                  styles.actionIconImage,
                  sortOption && styles.actionIconImageActive,
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setTempSelectedCarTypes([...selectedCarTypes]);
                setTempSelectedTags([...selectedTags]);
                setFilterModalVisible(true);
              }}
              activeOpacity={0.7}>
              <Image
                source={require('../Assest/Filter.png')}
                style={[
                  styles.actionIconImage,
                  (selectedCarTypes.length > 0 || selectedTags.length > 0) &&
                    styles.actionIconImageActive,
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>✓</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  ), [searchQuery]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  const showNoResults =
    !loading &&
    debouncedSearchQuery.trim().length > 0 &&
    filteredCars.length === 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      {showNoResults ? (
        <View style={styles.noResultsContainer}>
          {renderHeader()}
          <View style={styles.noResultsContent}>
            <View style={styles.noResultsIconContainer}>
              <View style={styles.iconWrapper}>
                <Text style={styles.folderEmoji}>📁</Text>
                <View style={styles.xBadge}>
                  <Text style={styles.xText}>✕</Text>
                </View>
              </View>
              <View style={styles.magnifyingWrapper}>
                <Text style={styles.magnifyingEmoji}>🔍</Text>
                <Text style={styles.questionMark}>?</Text>
              </View>
            </View>
            <Text style={styles.noResultsText}>
              No results found with '{debouncedSearchQuery}'
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredCars}
          renderItem={renderCar}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading && debouncedSearchQuery.trim().length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No cars available</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Sort Bottom Sheet Modal */}
      <Modal
        visible={sortModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setSortModalVisible(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetContent}>
              <Text style={styles.bottomSheetTitle}>Sorting Options</Text>
              
              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => {
                  if (sortOption === 'a-z') {
                    setSortOption(null);
                  } else {
                    setSortOption('a-z');
                  }
                }}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === 'a-z' && styles.sortOptionTextActive,
                  ]}>
                  Sort by A - Z {sortOption === 'a-z' ? '↓' : ''}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortOption, styles.sortOptionLast]}
                onPress={() => {
                  if (sortOption === 'date') {
                    setSortOption(null);
                  } else {
                    setSortOption('date');
                  }
                }}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.sortOptionText,
                    sortOption === 'date' && styles.sortOptionTextActive,
                  ]}>
                  Sort by Date Modified {sortOption === 'date' ? '↑' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Bottom Sheet Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setFilterModalVisible(false)}
          />
          <View style={styles.filterBottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <ScrollView
              style={styles.filterScrollView}
              contentContainerStyle={styles.filterContent}
              showsVerticalScrollIndicator={false}>
              <View style={styles.filterHeader}>
                <Text style={styles.bottomSheetTitle}>Filter By</Text>
                {(tempSelectedCarTypes.length > 0 || tempSelectedTags.length > 0) && (
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                      setTempSelectedCarTypes([]);
                      setTempSelectedTags([]);
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.resetIcon}>↻</Text>
                    <Text style={styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* CAR TYPE Section */}
              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>CAR TYPE</Text>
                  <Text style={styles.chevronIcon}>⌃</Text>
                </View>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      tempSelectedCarTypes.includes('manual') &&
                        styles.filterPillActive,
                    ]}
                    onPress={() => {
                      if (tempSelectedCarTypes.includes('manual')) {
                        setTempSelectedCarTypes(
                          tempSelectedCarTypes.filter((t) => t !== 'manual'),
                        );
                      } else {
                        setTempSelectedCarTypes([
                          ...tempSelectedCarTypes,
                          'manual',
                        ]);
                      }
                    }}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.filterPillText,
                        tempSelectedCarTypes.includes('manual') &&
                          styles.filterPillTextActive,
                      ]}>
                      Manual
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterPill,
                      tempSelectedCarTypes.includes('automatic') &&
                        styles.filterPillActive,
                    ]}
                    onPress={() => {
                      if (tempSelectedCarTypes.includes('automatic')) {
                        setTempSelectedCarTypes(
                          tempSelectedCarTypes.filter((t) => t !== 'automatic'),
                        );
                      } else {
                        setTempSelectedCarTypes([
                          ...tempSelectedCarTypes,
                          'automatic',
                        ]);
                      }
                    }}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.filterPillText,
                        tempSelectedCarTypes.includes('automatic') &&
                          styles.filterPillTextActive,
                      ]}>
                      Automatic
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Separator Line */}
              <View style={styles.filterSeparator} />

              {/* TAGS Section */}
              <View style={styles.filterSection}>
                <View style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>TAGS</Text>
                  <Text style={styles.chevronIcon}>⌃</Text>
                </View>
                <View style={styles.filterOptions}>
                  {availableTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.filterPill,
                        tempSelectedTags.includes(tag) &&
                          styles.filterPillActive,
                      ]}
                      onPress={() => {
                        if (tempSelectedTags.includes(tag)) {
                          setTempSelectedTags(
                            tempSelectedTags.filter((t) => t !== tag),
                          );
                        } else {
                          setTempSelectedTags([...tempSelectedTags, tag]);
                        }
                      }}
                      activeOpacity={0.7}>
                      <Text
                        style={[
                          styles.filterPillText,
                          tempSelectedTags.includes(tag) &&
                            styles.filterPillTextActive,
                        ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setSelectedCarTypes([...tempSelectedCarTypes]);
                  setSelectedTags([...tempSelectedTags]);
                  setFilterModalVisible(false);
                }}
                activeOpacity={0.8}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  placeholder: {
    flex: 1,
  },
  newCarButton: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  newCarButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
  },
  searchBarActive: {
    borderColor: '#A855F7',
    borderWidth: 1.5,
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    padding: 0,
    margin: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: '300',
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#FF0000',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionIcon: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
  },
  actionIconActive: {
    color: '#A855F7',
  },
  actionIconImage: {
    width: 18,
    height: 18,
    tintColor: '#000000',
  },
  actionIconImageActive: {
    tintColor: '#000000',
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  noResultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  noResultsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsIconContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  folderEmoji: {
    fontSize: 60,
    opacity: 0.4,
  },
  xBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  magnifyingWrapper: {
    position: 'absolute',
    top: 15,
    right: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  magnifyingEmoji: {
    fontSize: 40,
    opacity: 0.4,
  },
  questionMark: {
    position: 'absolute',
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D3D3D3',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  bottomSheetContent: {
    paddingHorizontal: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  sortOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  sortOptionLast: {
    borderBottomWidth: 0,
  },
  sortOptionText: {
    fontSize: 16,
    color: '#000',
  },
  sortOptionTextActive: {
    color: '#A855F7',
    fontWeight: '600',
  },
  filterBottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    // flex: 1,

    paddingTop: 8,
  },
  filterScrollView: {
    flex: 1,
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resetIcon: {
    fontSize: 16,
    color: '#A855F7',
    marginRight: 4,
  },
  resetText: {
    fontSize: 14,
    color: '#A855F7',
    fontWeight: '500',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSeparator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 24,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
  chevronIcon: {
    fontSize: 16,
    color: '#666',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    marginBottom: 8,
  },
  filterPillActive: {
    backgroundColor: '#E9D5FF',
  },
  filterPillText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#A855F7',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#A855F7',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

