import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';
import { MatMenuModule, MatToolbarModule, MatIconModule, MatRadioModule, MatInputModule, MatButtonModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [
    ToolbarComponent,
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    FlexLayoutModule

  ]
})
export class SharedModule { }
