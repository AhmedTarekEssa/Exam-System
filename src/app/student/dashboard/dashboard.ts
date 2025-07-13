import { Component, OnInit } from '@angular/core';
import { AdminRoutingModule } from "../../admin/admin-routing-module";
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-dashboard',
  imports: [AdminRoutingModule , CommonModule, RouterModule, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard {

    constructor(private auth: Auth, private router: Router) {}
    logout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

}
