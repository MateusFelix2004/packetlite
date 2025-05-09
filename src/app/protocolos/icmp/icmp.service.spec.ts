import { TestBed } from '@angular/core/testing';

import { IcmpService } from './icmp.service';

describe('IcmpService', () => {
  let service: IcmpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcmpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
