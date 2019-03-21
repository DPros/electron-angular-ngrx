import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CriterionListComponent} from './views/criterion-list/criterion-list.component';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ahmReducer} from './store/ahm.reducer';
import {AhmEffects} from './store/ahm.effects';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AhmStore} from './services/ahm-store.service';
import {AhmCalculationUtils} from './services/ahm-calculation.utils';
import {Ng5SliderModule} from 'ng5-slider';
import {GenericListComponent} from './views/generic-list/generic-list.component';
import {OptionsListComponent} from './views/options-list/options-list.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forChild([
      {path: 'criterion', component: CriterionListComponent},
      {path: 'options', component: OptionsListComponent},
      {path: '', redirectTo: 'options', pathMatch: 'full'}
    ]),
    Ng5SliderModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature('ahm', ahmReducer),
    EffectsModule.forFeature([AhmEffects]),
  ],
  declarations: [
    CriterionListComponent,
    GenericListComponent,
    OptionsListComponent
  ],
  providers: [
    AhmStore,
    AhmCalculationUtils
  ]
})
export class AhmModule {
}
