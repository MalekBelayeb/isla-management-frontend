import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value.email) return null;
  const regex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(control.value.email) ? null : { emailIncorrect: true };
};

export const cinValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value.cin) return null;
  const regex = /^\d{8}$/;
  return regex.test(control.value.cin) ? null : { cinIncorrect: true };
};

export const ribValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value.rib) return null;
  const regex = /^\d{20}$/;
  return regex.test(control.value.rib) ? null : { ribIncorrect: true };
};

export const phoneNumberTnValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (!control.value.phoneNumber) return null;

  const regex = /^\d{8}$/;
  return regex.test(control.value.phoneNumber)
    ? null
    : { phoneNumberIncorrect: true };
};
