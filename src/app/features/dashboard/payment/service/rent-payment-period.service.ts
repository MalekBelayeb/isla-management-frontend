import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RentPaymentPeriodService {
  getNextRentPaymentPeriod(
    startDate: Date,
    endDate?: Date,
  ): { startDate: Date; endDate: Date } | undefined {
    if (!startDate) {
      return undefined;
    }

    // Agreement with no rent yet:
    // startDate is the first day of the agreement.
    if (!endDate) {
      const start = new Date(startDate);

      return {
        startDate: start,
        endDate: new Date(
          Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
        ),
      };
    }

    return this.getNextDateRange(startDate, endDate);
  }

  private getNextDateRange(
    startDate: Date,
    endDate: Date,
  ): { startDate: Date; endDate: Date } {
    // Start the next range on the day after endDate.
    const newStartDate = new Date(endDate);

    newStartDate.setUTCDate(newStartDate.getUTCDate() + 1);

    // Last day of the month containing newStartDate.
    const newEndDate = new Date(
      Date.UTC(
        newStartDate.getUTCFullYear(),
        newStartDate.getUTCMonth() + 1,
        0,
      ),
    );

    return {
      startDate: newStartDate,
      endDate: newEndDate,
    };
  }
}
