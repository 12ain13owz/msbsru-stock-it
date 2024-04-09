import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  EMPTY,
  catchError,
  finalize,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { TokenService } from '../../modules/shared/services/token.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthApiService } from '../../modules/dashboard/services/auth/auth-api.service';
import { AccessToken } from '../../modules/shared/models/token.model';

let isRefreshToken: boolean = false;
const responseCache = new Map();

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.getAccessToken();
  const jwtHelper = inject(JwtHelperService);
  const authService = inject(AuthApiService);

  if (!accessToken || accessToken === 'undefined') return next(req);
  if (isRefreshToken) return next(req);

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  // const cache = responseCache.get(authRequest.urlWithParams);
  // if (cache) return of(cache);

  return next(authRequest).pipe(
    tap((res) => responseCache.set(authRequest.urlWithParams, res)),
    catchError((error) => {
      const expired = jwtHelper.isTokenExpired();
      if (expired) {
        isRefreshToken = true;

        return authService.refreshToken().pipe(
          switchMap((res: AccessToken) => {
            tokenService.setAccessToken(res.accessToken);

            const authReq = authRequest.clone({
              headers: authRequest.headers.set(
                'Authorization',
                `Bearer ${res.accessToken}`
              ),
            });
            return next(authReq);
          }),
          catchError((error) => EMPTY),
          finalize(() => (isRefreshToken = false))
        );
      }
      return throwError(() => error);
    })
  );
};

function canCache(req: HttpRequest<unknown>): boolean {
  return req.urlWithParams.includes('');
}
