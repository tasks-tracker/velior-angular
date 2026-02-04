import { Component } from '@angular/core';
import { Settings } from '@app/features/settings/ui/settings';

@Component({
  selector: 'app-settings-page',
  imports: [Settings],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {}
