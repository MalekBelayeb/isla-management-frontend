import { Injectable } from '@angular/core';
import { checkObjectIsSocietyType } from '@core/helpers';
import { CourseTimelineDetails } from '@models/old/course-timeline-details';

@Injectable({
  providedIn: 'root',
})
export class GetTimelineDetailsDTO {
  fromResponse(detailsVisits: any): CourseTimelineDetails[] {
    console.log(detailsVisits);
    return detailsVisits.map((course: any): CourseTimelineDetails => {
      return {
        fullname: `${course.fullname ?? ''}`,
        location: checkObjectIsSocietyType(course)
          ? `${course.societyAdress}`
          : `${course.destinationAdress}`,
        isSociety: checkObjectIsSocietyType(course),
        isIntermediate: course.isIntermediate ?? false,
        startTime: course.startTime
          ? `${new Date(course.startTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : '',
      };
    });
  }
}
