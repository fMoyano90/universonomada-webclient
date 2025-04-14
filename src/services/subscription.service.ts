import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

interface SubscriptionResponse {
  id: number;
  email: string;
  createdAt: string;
}

class SubscriptionService {
  private static instance: SubscriptionService;
  
  private constructor() {}

  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async createSubscription(email: string): Promise<SubscriptionResponse> {
    try {
      const response = await axios.post<SubscriptionResponse>(
        `${API_URL}/subscriptions`,
        { email }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('Error al crear la suscripción');
    }
  }
}

export default SubscriptionService.getInstance(); 