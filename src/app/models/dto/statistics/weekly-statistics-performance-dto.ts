import { WeeklyStatisticsPerformance } from '../../old/weekly-statistics-performance';

export class WeeklyStatisticsPerformanceDTO {
  fromResponse(response: any[]): WeeklyStatisticsPerformance[] {
    const results: WeeklyStatisticsPerformance[] = response.map(
      (item): WeeklyStatisticsPerformance => ({
        avgCoursePrice: item.avgCoursePrice,
        avgPassengerPrice: item.avgPassengerPriceTaxi,
        week: item.week,
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
