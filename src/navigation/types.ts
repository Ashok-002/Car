export type RootStackParamList = {
  CarLibrary: undefined;
  CarDetail: { carId: number };
  AddCar: undefined;
  Home: undefined;
  Services: undefined;
  Profile: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

