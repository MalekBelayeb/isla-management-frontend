export interface MonthlyStatisticsPerformance {
  month: number;
  totalTrips: number;
  totalTaxiTrips: number;
  totalBusTrips: number;
  sumPrice: number;
  sumTaxiPrice: number;
  sumBusPrice: number;
  avgCoursePrice: number;
  avgPassengerPrice: number;
}
