import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  standalone: true,
  imports: [CommonModule, NzMenuModule, RouterModule, NzDropDownModule, NzIconModule, NzButtonModule ]
})

export class HeaderComponent implements OnInit {

  menus = [
    {
      title: 'Fondos',
      options: [
        { label: 'Suscribirse', routerLink: 'funds/suscribe', selected: false },
        { label: 'Cancelar suscripción', routerLink: 'funds/cancel-subs', selected: false },
        { label: 'Historial Transacciones', routerLink: 'funds/transactions', selected: false }
      ],
      disabled: false
    },
    {
      title: 'Quiénes somos',
      options: [],
      disabled: true
    },
    {
      title: 'Qué hacemos',
      options: [],
      disabled: true
    },
    {
      title: 'Research',
      options: [],
      disabled: true
    },
    {
      title: 'Blog',
      options: [],
      disabled: true
    },
    {
      title: 'Trabaja con nosotros',
      options: [],
      disabled: true
    }
  ];

  constructor(private readonly router: Router) { };

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateMenuSelection(this.router.url);
      }
    });
    this.updateMenuSelection(this.router.url);
  };

  public updateMenuSelection(url: string): void {
    this.menus.forEach(menu => {
      menu.options.forEach(option => {
        option.selected = url.includes(option.routerLink);
      });
    });
  };

  isDropdownVisible = false;
  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  };

};