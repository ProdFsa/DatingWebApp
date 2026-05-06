import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./datingcomponents/home/home.module').then(m => m.HomeModule),
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./datingcomponents/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'matches',
    loadChildren: () => import('./datingcomponents/matches/matches.module').then(m => m.MatchesModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./datingcomponents/messages/messages.module').then(m => m.MessagesModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./datingcomponents/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./datingcomponents/register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./datingcomponents/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./datingcomponents/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
