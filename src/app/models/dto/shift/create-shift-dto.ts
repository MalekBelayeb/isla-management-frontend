import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

//arrivalAtHome -> mel khedma lel dar 

//departureFromHome -> mel dar lel khedma


@Injectable({
  providedIn: 'root',
})
export class CreateShiftDTO {
  toBodyRequest(
    formGroup: FormGroup,
    societyId: string,
    vehiculeTypeLeaving: string,
    vehiculeTypeArriving: string,
  ) {
    return {
      idSociety: societyId,
      label: formGroup.get('label')?.value,

      departureTransportType: vehiculeTypeArriving.toUpperCase(),
      arrivalTransportType: vehiculeTypeLeaving.toUpperCase(),

      departureFromHome: {
        ...(!isNaN(
          formGroup.get('mondayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('mondayDepartureFromHome')?.value.split(':')[1],
          ) && {
          monday: {
            hour:
              formGroup
                .get('mondayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('mondayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('tuesdayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('tuesdayDepartureFromHome')?.value.split(':')[1],
          ) && {
          tuesday: {
            hour:
              formGroup
                .get('tuesdayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('tuesdayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('wednesdayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('wednesdayDepartureFromHome')?.value.split(':')[1],
          ) && {
          wednesday: {
            hour:
              formGroup
                .get('wednesdayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('wednesdayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('thursdayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('thursdayDepartureFromHome')?.value.split(':')[1],
          ) && {
          thursday: {
            hour:
              formGroup
                .get('thursdayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('thursdayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('fridayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('fridayDepartureFromHome')?.value.split(':')[1],
          ) && {
          friday: {
            hour:
              formGroup
                .get('fridayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('fridayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('saturdayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('saturdayDepartureFromHome')?.value.split(':')[1],
          ) && {
          saturday: {
            hour:
              formGroup
                .get('saturdayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('saturdayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('sundayDepartureFromHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('sundayDepartureFromHome')?.value.split(':')[1],
          ) && {
          sunday: {
            hour:
              formGroup
                .get('sundayDepartureFromHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('sundayDepartureFromHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
      },
      arrivalAtHome: {
        ...(!isNaN(
          formGroup.get('mondayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('mondayarrivalAtHome')?.value.split(':')[1],
          ) && {
          monday: {
            hour:
              formGroup
                .get('mondayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('mondayarrivalAtHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('tuesdayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('tuesdayarrivalAtHome')?.value.split(':')[1],
          ) && {
          tuesday: {
            hour:
              formGroup
                .get('tuesdayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('tuesdayarrivalAtHome')
                ?.value.split(':')[1] ?? '',
          },
        }),

        ...(!isNaN(
          formGroup.get('wednesdayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('wednesdayarrivalAtHome')?.value.split(':')[1],
          ) && {
          wednesday: {
            hour:
              formGroup
                .get('wednesdayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('wednesdayarrivalAtHome')
                ?.value.split(':')[1] ?? '',
          },
        }),

        ...(!isNaN(
          formGroup.get('thursdayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('thursdayarrivalAtHome')?.value.split(':')[1],
          ) && {
          thursday: {
            hour:
              formGroup
                .get('thursdayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('thursdayarrivalAtHome')
                ?.value.split(':')[1] ?? '',
          },
        }),

        ...(!isNaN(
          formGroup.get('fridayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('fridayarrivalAtHome')?.value.split(':')[1],
          ) && {
          friday: {
            hour:
              formGroup
                .get('fridayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('fridayarrivalAtHome')
                ?.value.split(':')[1] ?? '',
          },
        }),

        ...(!isNaN(
          formGroup.get('saturdayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('saturdayarrivalAtHome')?.value.split(':')[1],
          ) && {
          saturday: {
            hour:
              formGroup
                .get('saturdayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup
                .get('saturdayarrivalAtHome')
                ?.value.split(':')[1] ?? '',
          },
        }),
        ...(!isNaN(
          formGroup.get('sundayarrivalAtHome')?.value.split(':')[0],
        ) &&
          !isNaN(
            formGroup.get('sundayarrivalAtHome')?.value.split(':')[1],
          ) && {
          sunday: {
            hour:
              formGroup
                .get('sundayarrivalAtHome')
                ?.value.split(':')[0] ?? '',
            minute:
              formGroup.get('sundayarrivalAtHome')?.value.split(':')[1] ??
              '',
          },
        }),
      },
    };
  }
}
