import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../../../shared/services/message.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private message: MessageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((err: any) => {
                    let err_as_string;
                    if (typeof err.error === 'object') {
                        err_as_string = JSON.stringify(err.error, null, '\t');
                    } else if (typeof err.error === 'string') {
                        err_as_string = err.error;
                    }
                    const error = `ERROR ${err.status}: ${err.statusText}\n${err_as_string}\n${err.message}`;
                    this.message.error(error);
                    return throwError(error);
                })
            );
    }
}
