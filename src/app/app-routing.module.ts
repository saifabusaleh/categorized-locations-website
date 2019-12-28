import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { CategoryAuthGuardService } from './guards/category-auth-guard.service';


const routes: Routes = [

  { path: '',
    component: HomeComponent,
  },
  {
    path: 'category/:name',
    component: CategoryDetailComponent,
    canActivate: [CategoryAuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
