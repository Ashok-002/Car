const API_BASE_URL = 'https://cars-mock-api-new-6e7a623e6570.herokuapp.com';

export interface Car {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  carType: 'automatic' | 'manual';
  tags?: string[];
  createdAt?: string;
}

export interface CarDetail extends Car {
  displacement?: string;
  fuelType?: string;
  topSpeed?: string;
  lastUpdated?: string;
}

export const fetchCars = async (): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

export const fetchCarById = async (id: number): Promise<CarDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch car details');
    }
    const data = await response.json();
    
    // Add mock detail fields if not present in API
    const carDetail: CarDetail = {
      ...data,
      displacement: data.displacement || '4951 cc',
      fuelType: data.fuelType || 'Petrol',
      topSpeed: data.topSpeed || '250 km/h',
      lastUpdated: data.lastUpdated || data.createdAt || new Date().toISOString(),
    };
    
    return carDetail;
  } catch (error) {
    console.error('Error fetching car details:', error);
    throw error;
  }
};

export interface CreateCarData {
  name: string;
  description: string;
  carType: 'automatic' | 'manual';
  imageUrl: string;
  tags?: string[];
}

export const createCar = async (carData: CreateCarData): Promise<Car> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Failed to create car';
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
};

export const deleteCar = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || 'Failed to delete car';
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
};

