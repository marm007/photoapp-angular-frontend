import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLogin: boolean;

  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
    this.isLogin = false;
  }

  ngOnInit(): void {
  }

}
