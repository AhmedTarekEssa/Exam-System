import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.html',
  styleUrl: './dashboard-content.css',
  standalone: true
})
export class DashboardContent implements OnInit {

  UserInfo: any;
  UserName!: string | null;

  ngOnInit(): void {
    const storedUser = localStorage.getItem("userInfo");

    if (storedUser) {
      this.UserInfo = JSON.parse(storedUser);        // Convert string to object
      this.UserName = this.UserInfo.username;        // Now safely access username
      console.log('Username:', this.UserName);
    } else {
      console.warn('No userInfo found in localStorage');
    }
  }

}
