# CarGo - Car Library Mobile App

A React Native mobile application for managing and browsing a car library. This app allows users to view a collection of cars, filter and search through them, view detailed information, and add new cars to the library.

## Platform

**React Native with TypeScript** - Supports both iOS and Android platforms.

Built with:
- React Native 0.83.1
- TypeScript 5.8.3
- React Navigation 7.x for navigation
- React Native Safe Area Context for safe area handling

## Features

### ✅ Implemented Features

All priority features from the assignment have been implemented:

#### 1. Main Car List (High Priority) ✅
- Scrollable grid layout displaying car cards
- Each card displays:
  - Car image
  - Car name
  - Car transmission type (automatic/manual) with color-coded badges
- Fetches all cars from the `/api/cars` endpoint
- Loading states with activity indicators
- Refresh on screen focus (e.g., after adding a car)

#### 2. Car Details Screen (High Priority) ✅
- Full-screen detail view when a car card is tapped
- Fetches complete car details from `/api/cars/:id` endpoint
- Displays:
  - Larger car image
  - Complete car name and description
  - Transmission type badge
  - Tags in a mobile-friendly format (displacement, fuel type, top speed)
  - Last updated date (formatted)
- Native navigation with back button
- Smooth transitions between list and detail views

#### 3. Sorting Functionality (High Priority) ✅
- Sort modal/bottom sheet interface
- Sorting options:
  - Car name (A-Z)
  - Creation date (newest first)
- Visual feedback for selected sort option
- Sorting is applied client-side for responsive UX

#### 4. Filtering System (High Priority) ✅
- Filter modal/bottom sheet interface
- Filter options:
  - Car types (automatic/manual) - multi-select
  - Tags - multi-select with visual tag chips
- Filter indicators show active filters
- Multiple filters can be combined
- Clear filters functionality

#### 5. Search Functionality (Medium Priority) ✅
- Search bar in the car list header
- Debounced search (300ms delay) for optimal performance
- Searches through car names and descriptions
- Clear button for quick reset
- Keyboard-friendly interface

#### 6. Create Car Form (Medium Priority) ✅
- "Add New Car" button navigates to creation form
- Mobile-optimized form with fields:
  - Image URL (required)
  - Name (required, up to 50 characters)
  - Description (optional, up to 200 characters, multi-line)
  - Car type dropdown (required: automatic/manual)
  - Tags multi-select (required)
- Form validation with error messages
- Character counter for description field
- Submits to `/api/cars` POST endpoint
- Navigates back to main list after successful creation

#### 7. Delete Car Functionality (Low Priority) ✅
- Delete button in car detail view
- Confirmation modal before deletion
- Uses `/api/cars/:id` DELETE endpoint
- Navigates back to list after successful deletion
- Error handling with user-friendly alerts

### Additional Features

- **Bottom Navigation**: Tab navigation for Home, Car Library, Services, and Profile screens
- **Safe Area Handling**: Proper handling of device safe areas (notch, status bar)
- **Error Handling**: User-friendly error messages and loading states
- **Form Validation**: Real-time validation with error indicators
- **Responsive Design**: Optimized for various mobile screen sizes

## Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment set up (see [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment))
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd CarGo
```

2. Install dependencies:
```sh
npm install
```

3. For iOS, install CocoaPods dependencies:
```sh
# First time only: Install CocoaPods bundler
bundle install

# Install pod dependencies
cd ios
bundle exec pod install
cd ..
```

### Running the App

#### Step 1: Start Metro

Start the Metro bundler:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

#### Step 2: Run on Device/Emulator

With Metro running, open a new terminal and run:

**For Android:**
```sh
npm run android
# OR
yarn android
```

**For iOS:**
```sh
npm run ios
# OR
yarn ios
```

### Building for Production

**Android:**
```sh
cd android
./gradlew assembleRelease
```

**iOS:**
Open `ios/CarGo.xcworkspace` in Xcode and build from there.

## API Configuration

The app connects to the following backend API:

- **API Base URL**: `https://cars-mock-api-new-6e7a623e6570.herokuapp.com`
- **Endpoints Used**:
  - `GET /api/cars` - Fetch all cars
  - `GET /api/cars/:id` - Fetch car details
  - `POST /api/cars` - Create new car
  - `DELETE /api/cars/:id` - Delete car

No additional API configuration is required - the base URL is configured in `src/services/api.ts`.

## Assumptions and Technical Decisions

### 1. **Client-Side Sorting and Filtering**
- **Decision**: Sorting and filtering are implemented client-side rather than using API query parameters
- **Rationale**: This provides instant feedback and better UX for users. The implementation loads all cars and applies filters/sorting in memory
- **Trade-off**: For very large datasets, this approach may need optimization or server-side filtering

### 2. **State Management**
- **Decision**: Used React hooks (useState, useEffect) for local state management
- **Rationale**: The app's state needs are relatively simple, and local state with context would be sufficient. No global state management library (Redux, Zustand) was needed

### 3. **Navigation**
- **Decision**: React Navigation with Native Stack Navigator
- **Rationale**: Provides native navigation patterns, smooth animations, and type-safe navigation with TypeScript

### 4. **Form Handling**
- **Decision**: Controlled components with local state for form management
- **Rationale**: Provides fine-grained control over validation and user feedback without additional dependencies

### 5. **Tag Filtering Implementation**
- **Decision**: Uses hardcoded tag list for filtering (tags are not fetched from `/api/cars/tags` endpoint)
- **Rationale**: Simplified implementation for the assignment; tags are available in the form for selection
- **Note**: In production, tags should be fetched dynamically from the API

### 6. **Search Implementation**
- **Decision**: Client-side search with debouncing
- **Rationale**: Provides instant results and reduces API calls
- **Note**: For large datasets, server-side search with API query parameters would be more efficient

### 7. **Type Safety**
- **Decision**: Full TypeScript implementation with interfaces for API responses
- **Rationale**: Type safety helps prevent errors and improves developer experience

### 8. **Component Architecture**
- **Decision**: Reusable components (CarCard, BottomNavigation) to avoid code duplication
- **Rationale**: Follows React best practices for maintainability and reusability

## Future Improvements

With more time, I would implement the following enhancements:

1. **API Integration Improvements**:
   - Implement server-side sorting using `sortBy` and `sortOrder` query parameters
   - Fetch car types dynamically from `/api/cars/types` endpoint
   - Fetch tags dynamically from `/api/cars/tags` endpoint
   - Implement server-side search using the `search` query parameter
   - Add pagination for large datasets

2. **Error Handling**:
   - Add error boundaries for better error recovery
   - Implement retry logic for failed API requests
   - Add offline support with local caching
   - Better error messages with actionable guidance

3. **Performance Optimizations**:
   - Implement image caching for car images
   - Add virtualization for very long lists
   - Optimize re-renders with React.memo and useMemo
   - Lazy loading for images

4. **User Experience**:
   - Pull-to-refresh functionality
   - Empty states with helpful messages
   - Loading skeletons instead of spinners
   - Animations for list items and transitions
   - Haptic feedback for interactions

5. **Testing**:
   - Unit tests for components and utilities
   - Integration tests for API calls
   - End-to-end tests for critical user flows
   - Snapshot testing for UI components

6. **Additional Features**:
   - Edit car functionality
   - Favorites/bookmarking system
   - Share car details
   - Image upload instead of URL input
   - Advanced filtering options (price range, year, etc.)

7. **Code Quality**:
   - Add ESLint configuration
   - Set up Prettier for consistent code formatting
   - Add pre-commit hooks
   - Improve code documentation with JSDoc comments

8. **Accessibility**:
   - Add accessibility labels
   - Support for screen readers
   - Keyboard navigation improvements
   - High contrast mode support

## Project Structure

```
CarGo/
├── src/
│   ├── components/          # Reusable components
│   │   ├── BottomNavigation.tsx
│   │   └── CarCard.tsx
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── screens/            # Screen components
│   │   ├── AddCarScreen.tsx
│   │   ├── CarDetailScreen.tsx
│   │   ├── CarLibraryScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ServicesScreen.tsx
│   ├── services/           # API and business logic
│   │   └── api.ts
│   └── Assest/            # Images and assets
├── android/               # Android native code
├── ios/                   # iOS native code
└── App.tsx               # Root component
```

## Screenshots

_Screenshots and screen recordings will be added here to demonstrate the app functionality._

_Include screenshots of:_
- _Main car list with grid layout_
- _Car detail screen_
- _Add car form_
- _Sort and filter modals_
- _Search functionality_
- _Delete confirmation modal_

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```sh
# Clear Metro cache
npm start -- --reset-cache
```

**iOS build issues:**
```sh
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
```

**Android build issues:**
```sh
# Clean Android build
cd android
./gradlew clean
cd ..
```

**Node modules issues:**
```sh
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

For more troubleshooting help, see the [React Native Troubleshooting guide](https://reactnative.dev/docs/troubleshooting).

## License

This project was created as a frontend development assignment.
