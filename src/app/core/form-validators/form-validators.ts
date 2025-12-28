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

export const bankFieldRequiredIfMethodIsCheckValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value.method != 'check') return null;

  return control.value.bank
    ? null
    : { bankFieldIsRequired: true };
};

export const checkNumberFieldRequiredIfMethodIsCheckValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value.method != 'check') return null;
  const regex = /^(0|[1-9]\d*)$/;
  return regex.test(control.value.checkNumber)
    ? null
    : { checkNumberFieldIsIncorrect: true };
};

export const transferNumberFieldRequiredIfMethodIsTransferValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value.method != 'transfer') return null;
  const regex = /^(0|[1-9]\d*)$/;
  return regex.test(control.value.transferNumber)
    ? null
    : { transferNumberFieldIsIncorrect: true };
};


export const agreementIdFieldRequiredIfcategoryIsRentValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value.category != 'rent') return null;
  return control.value.agreementId
    ? null
    : { transferNumberFieldIsRequired: true };
};
