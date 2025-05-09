import { TestBed } from '@angular/core/testing';

import { ArpService } from './arp.service';

describe('ArpService', () => {
  let service: ArpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
