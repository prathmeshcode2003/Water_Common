/**
 * Services Index
 * 
 * Centralized exports for all service modules.
 * This makes importing services easier and more organized.
 */

// Water Consumer Service
export {
  searchConsumer,
  fetchMeterReadings,
  submitMeterReading,
  type WaterConsumerSearchParams,
} from './waterConsumerService';

// Meter Reading Service  
export {
  fetchConsumerMeterReadings,
  fetchAllMeterReadings,
  fetchMeterReadingById,
  createMeterReading,
  updateMeterReading,
  deleteMeterReading,
  formatMeterReadingForDisplay,
  type MeterReading,
  type CreateMeterReadingRequest,
  type UpdateMeterReadingRequest,
} from './meterReadingService';

// API Service
export * from './api.service';