import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root',
})
export class QueryStringBuilder {

    create(params: Record<string, unknown>, formGroup?: FormGroup) {

        const objParams: Record<string, unknown> = {}

        for (const [key, value] of Object.entries(params)) {
            objParams[key] = value
        }

        if (formGroup) {
            for (const [key, control] of Object.entries(formGroup.controls)) {
                if (control.value) objParams[key] = control.value
            }
        }

        return Object.entries(objParams).map(e => e.join('=')).join('&');

    }

}