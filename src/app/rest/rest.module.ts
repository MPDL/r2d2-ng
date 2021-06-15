import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RestRoutingModule } from './rest-routing.module';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { DatasetEditorComponent } from './components/dataset-editor/dataset-editor.component';
import { DatasetComponent } from './components/dataset/dataset.component';
import { FacetComponent } from './components/views/facet/facet.component';
import { RestComponent } from './rest.component';
import { ListViewComponent } from './components/views/list-view/list-view.component';
import { FileListComponent } from './components/views/file-list/file-list.component';
import { VersionListComponent } from './components/views/version-list/version-list.component';
import { DatasetReviewComponent } from './components/dataset-review/dataset-review.component';
import { PaginationDirective } from './directives/pagination.directive';

@NgModule({
  declarations: [
    DatasetListComponent,
    DatasetEditorComponent,
    DatasetComponent,
    FacetComponent,
    RestComponent,
    ListViewComponent,
    FileListComponent,
    VersionListComponent,
    DatasetReviewComponent,
    PaginationDirective    
  ],
  imports: [
    CommonModule,
    SharedModule,
    RestRoutingModule
  ]
})
export class RestModule { }
