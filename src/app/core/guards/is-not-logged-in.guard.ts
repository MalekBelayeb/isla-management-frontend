import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/features/auth/service/user.service';
import { User } from '@models/user';
import { UserMapper } from '@models/mappers/user-mapper';

@Injectable({
  providedIn: 'root',
})
export class IsNotLoggedInGuard {
  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      const value = await firstValueFrom(this.userService.fetchUser());
      console.log(value);

      const _user = value.body.data;

      console.log(_user);

      const user: User = UserMapper.fromResponse(_user);

      if (user) {
        this.router.navigate(['/dashboard']);
      }

      this.userService.setUser(user);
      return true;
    } catch (err) {
      return true;
    }
  }
}
