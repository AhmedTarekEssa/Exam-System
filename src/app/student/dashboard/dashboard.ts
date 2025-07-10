import { Component } from '@angular/core';
import { AdminRoutingModule } from "../../admin/admin-routing-module";

@Component({
  selector: 'app-dashboard',
  imports: [AdminRoutingModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

}
