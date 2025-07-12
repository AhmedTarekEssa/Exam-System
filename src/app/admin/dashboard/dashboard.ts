import { Component, HostListener } from '@angular/core';
import { AdminRoutingModule } from "../admin-routing-module";
import { Auth } from '../../core/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminRoutingModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  sidebarActive = false;
  activeTab: string = 'dashboard';
  isMobile = window.innerWidth < 992;

  constructor(private auth: Auth, private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.sidebarActive = false;
    }
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (this.isMobile) {
      this.sidebarActive = false;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
