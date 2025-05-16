import { TestBed } from '@angular/core/testing';

import { customersService } from './customers.service';

describe('customersService', () => {
  let service: customersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(customersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
