import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserMapper } from '@models/mappers/user-mapper';
import { User } from '@models/user';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/features/auth/service/user.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard {
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      console.log(document.cookie);

      const value = await firstValueFrom(this.userService.fetchUser());

      const _user = value.body.data;

      console.log(_user);

      const user: User = UserMapper.fromResponse(_user);

      this.userService.setUser(user);

      return true;
    } catch (err) {
      console.log(err);
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
