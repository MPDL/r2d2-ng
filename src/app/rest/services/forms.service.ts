import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { R2d2Service } from './r2d2.service';
import { MessageService } from '../../shared/services/message.service';
import { of, EMPTY, Observable } from 'rxjs';
import { DatasetVersion, Publication, Affiliation, Person, License } from '../../shared/components/model/entities';
import { map, catchError, last, tap } from 'rxjs/operators';

export function mustOrNot(regExp: RegExp, must: boolean): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const test = regExp.test(control.value);
    if (must) {
      return (!test) ? { mustOrNot: { value: control.value } } : null;
    } else {
      return test ? { mustOrNot: { value: control.value } } : null;
    }
  };
}

const URL_PATTERN: RegExp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
const ORCID_PATTERN: RegExp = /^http[s]?:\/\/orcid.org\/(\d{4})-(\d{4})-(\d{4})-(\d{3}[0-9X])$/;

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(
    private service: R2d2Service,
    private message: MessageService,
    private builder: FormBuilder
  ) { }

  emptyDataset(person): Observable<FormGroup> {
    return of(this.builder.group({
      title: ['', [Validators.required, Validators.minLength(4), mustOrNot(/title/i, false)]],
      authors: person ? this.builder.array([this.creatorAsAuthor(person)]) : this.builder.array([this.emptyAuthor()]),
      description: [''],
      doi: [''],
      genres: [[]],
      keywords: [[]],
      license: this.emptyLicense(),
      language: [''],
      correspondingPapers: this.builder.array([
        this.emptyPublication()
      ])
    }));
  }

  dataset(id: string): Observable<FormGroup> {
    return this.service.get(id).pipe(
      map((dataset: DatasetVersion) => {
        return this.builder.group({
        title: [dataset.metadata.title, Validators.required],
        authors: dataset.metadata.authors.length > 0 ?
          this.builder.array(dataset.metadata.authors.map((author: Person) => this.author(author))) :
          this.builder.array([this.emptyAuthor()]),
        description: [dataset.metadata.description || ''],
        doi: [dataset.metadata.doi || ''],
        genres: [dataset.metadata.genres || []],
        keywords: [dataset.metadata.keywords || []],
        license: dataset.metadata.license ?
          this.license(dataset.metadata.license) :
          this.emptyLicense(),
        language: [dataset.metadata.language || ''],
        correspondingPapers: dataset.metadata.correspondingPapers && dataset.metadata.correspondingPapers.length > 0 ?
          this.builder.array(dataset.metadata.correspondingPapers.map((publication: Publication) => this.publication(publication))) :
          this.builder.array([this.emptyPublication()])
      });
    }),
    catchError((error) => {
      this.message.error(error);
      return EMPTY;
    })
    );
  }

  emptyAuthor(): FormGroup {
    return this.builder.group({
      givenName: [''],
      familyName: [''],
      orcid: [''],
      affiliations: this.builder.array([
        this.emptyAfffiliation()
      ])
    });
  }

  creatorAsAuthor(p: Person): FormGroup {
    return this.builder.group({
      givenName: [p.givenName],
      familyName: [p.familyName],
      orcid: [p.orcid],
      affiliations: p.affiliations ?
        this.builder.array(p.affiliations.map((ou: Affiliation) => this.creatorAffiliation(ou))) :
        this.builder.array([this.emptyAfffiliation()])
    });
  }

  author(author: Person): FormGroup {
      return this.builder.group({
        givenName: [author.givenName || ''],
        familyName: [author.familyName || ''],
        orcid: [author.orcid || ''],
        affiliations: author.affiliations && author.affiliations.length > 0 ?
          this.builder.array(author.affiliations.map((ou: Affiliation) => this.affiliation(ou))) :
          this.builder.array([this.emptyAfffiliation()])
      });
  }

  emptyAfffiliation(): FormGroup {
    return this.builder.group({
      organization: [''],
      department: [''],
      id: ['']
    });
  }

  creatorAffiliation(a: Affiliation): FormGroup {
    return this.builder.group({
      organization: [a.organization],
      department: [a.department],
      id: [a.id]
    });
  }

  affiliation(affiliation: Affiliation): FormGroup {
    return this.builder.group({
      organization: [affiliation.organization || ''],
      department: [affiliation.department || ''],
      id: [affiliation.id || '']
    });
  }

  emptyPublication(): FormGroup {
    return this.builder.group({
      title: [''],
      url: ['']
    });
  }

  publication(publication: Publication): FormGroup {
    return this.builder.group({
      title: [publication.title || ''],
      url: [publication.url || '']
    });
  }

  emptyLicense(): FormGroup {
    return this.builder.group({
      name: [''],
      url: ['']
    });
  }

  license(license: License): FormGroup {
    return this.builder.group({
      name: [license.name || ''],
      url: [license.url || '']
    });
  }
}
