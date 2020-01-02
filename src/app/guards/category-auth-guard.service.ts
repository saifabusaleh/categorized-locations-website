import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

import { CategoryService } from '../services/category/category.service';
import { CategoryResponse } from '../model/category.response';

@Injectable({
  providedIn: 'root'
})
export class CategoryAuthGuardService {

    
  constructor(private categoryService: CategoryService,
    private router: Router) { 
    //
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const categoryName: string = next.url && next.url.length > 1 && next.url[1].path;
    return this.categoryService.getCategoryByName(categoryName).pipe(map((response: CategoryResponse) => {
      if (response.status) {
        this.router.navigate(['/'], { replaceUrl: true });
        return false;
      }
      return true;
    }));
  }
}
