import { Component } from '@angular/core';
import { Dashboard } from '@app/features/dashboard/ui/dashboard/dashboard';

@Component({
  selector: 'app-dashboard-page',
  imports: [Dashboard],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {}
