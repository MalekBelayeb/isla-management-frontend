import { Injectable } from "@angular/core"
import { CoursePassengersDetails } from "@models/old/passenger-details";

@Injectable({
    providedIn: 'root',
})
export class CoursePassengersDetailsDTO {
    fromResponse(passengerDetails: any): CoursePassengersDetails[] {

        return passengerDetails?.map(
            (user: any): CoursePassengersDetails => {
                return {
                    id: `${user.userId ?? ''}`,
                    fullname: `${user.fullname ?? ''}`,
                    phoneNumber: `${user.phoneNumber ?? 0}`,
                };
            },
        );
    }
}
