import { Injectable } from '@angular/core';
import { User } from '@models/user';

@Injectable({
  providedIn: 'root',
})
export class UserMapper {
  static fromResponse(data: any): User {
    return {
      id: data.id,
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      societyId: '',
      societyLogo: 'isla-immobiliere-logo.png',
      societyName: 'ISLA Immobilière',
      type: data.role,
      webSite: '',
    };
  }
}
