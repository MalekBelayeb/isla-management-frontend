import { Injectable } from '@angular/core';
import { checkObjectIsSocietyType } from '@core/helpers';
import { CourseMapDetails } from '@models/old/course-map-details';

@Injectable({
  providedIn: 'root',
})
export class CourseMapDetailsDTO {
  fromResponse(detailsVisits: any): CourseMapDetails[] {
    return detailsVisits?.map((course: any): CourseMapDetails => {
      return {
        userId: course.userId ?? '',
        phoneNumber: course.phoneNumber ?? 0,
        fullname: course.fullname ?? '',
        eta: ` `,
        adress: checkObjectIsSocietyType(course)
          ? `${course.societyAdress ?? ''}`
          : `${course.destinationAdress ?? ''}`,
        lat: checkObjectIsSocietyType(course)
          ? parseFloat(`${course.societyLat ?? 0}`)
          : parseFloat(`${course.destinationLat ?? 0}`),
        lng: checkObjectIsSocietyType(course)
          ? parseFloat(`${course.societyLng ?? 0}`)
          : parseFloat(`${course.destinationLng ?? 0}`),
        isIntermediate: course.isIntermediate ?? false,
        isPickup: course.isPickup ?? false,
      };
    });
  }
}
