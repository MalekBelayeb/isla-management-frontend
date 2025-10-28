import { ShiftStatisticsPerformance } from '../../old/shift-statistics-performance';

export class ShiftStatisticsPerformanceDTO {
  fromResponse(bodyResponse: any[]): ShiftStatisticsPerformance[] {
    const results: ShiftStatisticsPerformance[] = bodyResponse.map(
      (item): ShiftStatisticsPerformance => ({
        timeShift: item.timeShift,
        avgPrice: item.avgPrice,
        sumPrice: item.sumPrice,
        totalTrips: item.totalTrips,
        sumPricePercentage: item.sumPricePercentage,
        countTripsPercentage: item.countTripsPercentage
      })
    );
    return results;
  }
}
