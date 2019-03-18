import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NgxElectronModule} from 'ngx-electron';
import {environment} from '../environments/environment';
import {CoreModule} from 'app/core/core.module';
import {AppComponent} from 'app/core/containers/app';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {CustomRouterStateSerializer} from 'app/shared/utils';
import {metaReducers, reducers} from 'app/reducers/root.reducer';
import {AhmModule} from './ahm/ahm.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    NgxElectronModule,
    CommonModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    CoreModule.forRoot(),
    AhmModule,
    RouterModule.forRoot([{path: './', redirectTo: './criterion'}]),
  ],
  providers: [
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
