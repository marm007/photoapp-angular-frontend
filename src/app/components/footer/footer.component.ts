import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;

  constructor(private deviceService: DeviceDetectorService) {
    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();
    this.isDesktop = deviceService.isDesktop();
  }

  ngOnInit(): void {
  }

}
