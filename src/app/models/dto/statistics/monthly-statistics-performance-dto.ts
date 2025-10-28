import { MonthlyStatisticsPerformance } from '../../old/monthly-statistics-performance';

export class MonthlyStatisticsPerformanceDTO {
  fromResponse(response: any[]): MonthlyStatisticsPerformance[] {
    const results: MonthlyStatisticsPerformance[] = response.map(
      (item): MonthlyStatisticsPerformance => ({
        avgCoursePrice: item.avgCoursePrice,
        avgPassengerPrice: item.avgPassengerPriceTaxi,
        month: item.month,
        sumTaxiPrice: item.sumTaxiPrice,
        sumPrice: item.sumPrice,
        sumBusPrice: item.sumBusPrice,
        totalTaxiTrips: item.totalTaxiTrips,
        totalBusTrips: item.totalBusTrips,
        totalTrips: item.totalTrips,
      })
    );
    return results;
  }
}
