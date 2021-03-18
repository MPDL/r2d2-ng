import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../../../shared/services/data-store.service';
import { UserAccount, Grant } from '../../../shared/components/model/entities';
import { Observable } from 'rxjs';
import { MessageService } from '../../../shared/services/message.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { confirm_delete_dataset } from '../../../shared/components/model/confirmation-messages';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { FormsService } from '../../../rest/services/forms.service';

@Component({
  selector: 'r2d2-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  base = environment.r2d2_admin_uri;
  context = '/users/';
  user: Observable<UserAccount>;
  editing = false;
  user_form: FormGroup;

  constructor(
    private service: DataStoreService<UserAccount>,
    private message: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private form_service: FormsService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.user = this.service.data.pipe(
      map(users => users.find(u => u.id === id))
    );
  }

  back2list(): void {
    this.router.navigate(['admin/users']);
  }

  edit(user): void {
    this.editing = true;
    this.user_form = this.builder.group({
      email: [user.email],
      active: [user.active],
      person: this.form_service.author(user.person),
      grants: user.grants && user.grants.length > 0 ?
        this.builder.array(user.grants.map((grant: Grant) => this.grant(grant))) :
        this.builder.array([this.emptyGrant()])
    });
  }

  get person(): FormGroup {
    return this.user_form.get('person') as FormGroup;
  }

  get grants(): FormArray {
    return this.user_form.get('grants') as FormArray;
  }

  addGrant(): void {
    this.grants.push(this.emptyGrant());
  }

  removeGrant(i): void {
    if (this.grants.length <= 1) {
      this.message.warning('grant is required!');
    } else {
      this.grants.removeAt(i);
    }
  }

  handleGrants(event: string, index): void {
    if (event === 'add') {
      this.addGrant();
    } else if (event === 'remove') {
      this.removeGrant(index);
    }
  }


  handlePerson(event: string): void {
    if (event.includes('add')) {
      this.message.warning('paranoid schizophrenia?');
    } else if (event.includes('remove')) {
      this.message.warning('suicidal tendency?');
    }
  }

  onFormSubmit(id, lmd): void {
    const body = Object.assign(this.user_form.value, { id, modificationDate: lmd });
    this.service.update(this.base + this.context + id, body, 'id');
    this.editing = false;
  }

  delete(id): void {
    const confirm = this.message.displayConfirmation(confirm_delete_dataset(id));
    confirm.afterClosed().subscribe(ok => {
      if (ok) {
        this.user = undefined;
        this.service.delete(this.base + this.context + id, id, 'id');
        this.message.success(`deleted ${id}`);
        this.router.navigate(['admin/users']);
      }
    });
  }

  grant(grant): FormGroup {
    return this.builder.group({
      role: [grant.role],
      dataset: [grant.dataset],
    });
  }

  emptyGrant(): FormGroup {
    return this.builder.group({
      role: [],
      dataset: [],
    });
  }
}
