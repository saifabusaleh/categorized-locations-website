import { AppComponent } from './components/app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import { MatSortModule } from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


import { CategoryDialog } from './dialogs/category-dialog/category-dialog';
import { FormsModule } from '@angular/forms';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LocationListComponent } from './components/location-list/location-list.component';
import { BottomToolbarComponent } from './components/bottom-toolbar/bottom-toolbar.component';
import { LocationViewComponent } from './components/location-view/location-view.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LocationFormDialogComponent } from './dialogs/location-form-dialog/location-form-dialog.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    CategoryDialog,
    CategoryListComponent,
    ToolbarComponent,
    LocationListComponent,
    LocationFormDialogComponent,
    BottomToolbarComponent,
    LocationViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACCrhxPECAdny-D4CO5R6hG_Vo8vjHmR8'
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CategoryDialog, LocationFormDialogComponent]
})
export class AppModule { }
