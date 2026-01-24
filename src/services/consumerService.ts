import axios from 'axios';

/**
 * Fetches and verifies consumer data using the /api/wtis/search-consumer endpoint.
 * @param params - Query parameters for searching the consumer.
 * @returns Promise resolving to the consumer data.
 */
export const fetchConsumerData = async (params: Record<string, any>) => {
    try {
        const response = await axios.get('/api/wtis/search-consumer', { params });
        return response.data;
    } catch (error) {
        // Log and rethrow error for handling in the component
        console.error('Error fetching consumer data:', error);
        throw error;
    }
};
