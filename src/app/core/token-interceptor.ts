import { HttpInterceptorFn } from '@angular/common/http';
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const t = localStorage.getItem('token');
  console.log('Token enviado en', req.url, ':', t)
  return next(t ? req.clone({ setHeaders: { Authorization: `Bearer ${t}` } }) : req);
};
