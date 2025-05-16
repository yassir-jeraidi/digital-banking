import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    url: `${environment.apiUrl}/${req.url}`
  });

  // Pass the modified request to the next handler
  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Optional: Handle errors if needed
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
