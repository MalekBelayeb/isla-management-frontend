import { DailyStatisticsPerformance } from '@models/old/daily-statistics-performance';

export class DailyStatisticsPerformanceDTO {
  fromResponse(response: any[]): DailyStatisticsPerformance[] {
    const results: DailyStatisticsPerformance[] = response.map(
      (item): DailyStatisticsPerformance => ({
        dateCourse: item.dateCourse,
        month: item.month,
        day: item.day,
        totalTrips: item.totalTrips,
        totalTaxiTrips: item.totalTaxiTrips,
        totalBusTrips: item.totalBusTrips,
        sumPrice: item.sumPrice,
        sumBusPrice: item.sumBusPrice,
        sumTaxiPrice: item.sumTaxiPrice,
        countPassengerTaxi: item.countPassengerTaxi,
        countPassengerBus: item.countPassengerBus,
        avgPassengerPriceTaxi: item.avgPassengerPriceTaxi,
        avgPassengerPriceBus: item.avgPassengerPriceBus,
      }),
    );
    return results;
  }
}
