import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { NavItem } from '../../components/nav-item';

@Component({
  selector: 'kaf-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public routeList: NavItem[] = [
    {
      label: 'Criterion',
      routerLink: './criterion'
    },
    {
      label: 'Options',
      routerLink: './options'
    },
    {
      label: 'About',
      routerLink: './about'
    }
  ];

}
