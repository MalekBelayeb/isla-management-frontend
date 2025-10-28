import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/features/auth/service/user.service';
import { User } from '@models/old/user';

@Injectable({
  providedIn: 'root'
})
export class IsAdminLoggedInGuard {

  constructor(private router: Router, private userService: UserService) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    try {
     /* 
      console.log(document.cookie)

      const value = (await firstValueFrom(this.userService.fetchUser()))

      const _user = value.body.data
      
      console.log(_user)

      const user: User = {

        societyId: _user.id,
        societyName: _user.name,
        societyLogo: _user.logo,
        webSite: _user.webSite,
        firstname: _user.responsibleSociety?.prenomUser,
        lastname: _user.responsibleSociety?.nomUser,
        email: _user.email,
        siteName: _user.siteName ?? "",
        type: _user.responsibleSociety?.role == 'ADMIN' ? 'admin' : 'responsible'
      }

      return user.type === 'admin'*/
      return true
    } catch (err) {
      console.log(err)
      return true
    }

  }

}
