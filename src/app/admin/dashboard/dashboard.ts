import { Component } from '@angular/core';
import { AdminRoutingModule } from "../admin-routing-module";
import { Auth } from '../../core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [AdminRoutingModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(private auth: Auth , private router: Router) {

  }
  activeTab: string = 'dashboard';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  logout(){
    this.auth.logout();
    this.router.navigate(['/auth/login']);
    console.log('Logged out');
  }
}
