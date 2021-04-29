import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from '../core/services/login.guard';
import { DatasetComponent } from './components/dataset/dataset.component';
import { DatasetEditorComponent } from './components/dataset-editor/dataset-editor.component';
import { DatasetListComponent } from './components/dataset-list/dataset-list.component';
import { SetResolverService } from './services/set-resolver.service';
import { SetWithFilesResolverService } from './services/set-with-files-resolver.service';
import { DatasetReviewComponent } from './components/dataset-review/dataset-review.component';

const routes: Routes = [
  { path: 'sets', component: DatasetListComponent },
  // { path: 'set-viewer/:id', component: DatasetComponent, resolve: { set: SetWithFilesResolverService} },
  { path: 'set-viewer/:id', component: DatasetComponent },
  { path: 'set-viewer/:id/:review_token', component: DatasetReviewComponent },
  {
    path: 'set-editor/:id',
    component: DatasetEditorComponent,
    resolve: { set: SetResolverService },
    canActivate: [ LoginGuard ]
  },
  { path: '', component: DatasetListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestRoutingModule {}
