export interface DailyStatisticsPerformance {
  dateCourse: number;
  month: number;
  day: number;
  totalTrips: number;
  totalTaxiTrips: number;
  totalBusTrips: number;
  sumPrice: number;
  sumBusPrice: number;
  sumTaxiPrice: number;
  countPassengerTaxi: number;
  countPassengerBus: number;
  avgPassengerPriceTaxi: number;
  avgPassengerPriceBus: number;
}
