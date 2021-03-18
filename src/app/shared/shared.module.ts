import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { MessageComponent } from './components/message/message.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { MessageService } from './services/message.service';
import { UploadDialogComponent } from './components/upload-dialog/upload-dialog.component';
import { ChipsComponent } from './components/chips/chips.component';
import { MultiInitComponent } from './components/multi-init/multi-init.component';
import { MultiUploadComponent } from './components/multi-upload/multi-upload.component';
import { AuthorComponent } from './components/model/author/author.component';
import { AffiliationComponent } from './components/model/affiliation/affiliation.component';
import { PublicationComponent } from './components/model/publication/publication.component';
import { HighLightJsonPipe } from './services/high-light-json.pipe';
import { LicenseComponent } from './components/model/license/license.component';
import { GrantComponent } from './components/model/grant/grant.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSliderModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatSliderModule,
    PageNotFoundComponent,
    ValidationErrorsComponent,
    UploadDialogComponent,
    ChipsComponent,
    AuthorComponent,
    AffiliationComponent,
    PublicationComponent,
    LicenseComponent,
    HighLightJsonPipe,
    GrantComponent
  ],
  declarations: [
    PageNotFoundComponent,
    ValidationErrorsComponent,
    MessageComponent,
    ConfirmationComponent,
    UploadDialogComponent,
    ChipsComponent,
    MultiInitComponent,
    MultiUploadComponent,
    AuthorComponent,
    AffiliationComponent,
    PublicationComponent,
    HighLightJsonPipe,
    LicenseComponent,
    GrantComponent
  ],
  providers: [
    MessageService
  ]
})
export class SharedModule { }
