import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { EmployeeClientService } from 'src/app/features/employee/service/employee-client.service';
import { UpdateEmployeeSharedDataService } from 'src/app/features/employee/service/update-employee-shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class IsValidEmployeeClientGuard  {


  constructor(private router: Router, private employeeClientService: EmployeeClientService, private updateEmployeeSharedData: UpdateEmployeeSharedDataService) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    try {

      const token = route.paramMap.get('token') ?? ""

      const value = (await firstValueFrom(this.employeeClientService.verifyUserToken(token)))

      console.log(value.body)

      if (!value.body.response) {
        this.router.navigate(['/employee/error'])
        return false
      }

      this.updateEmployeeSharedData.setSocietyId(value.body.data.societyId)

      return value.body;

    } catch (err) {
      console.log(err)
      this.router.navigate(['/employee/error'])
      return false
    }
  }

}
