import { TestBed } from '@angular/core/testing';

import { RallyService } from './rally.service';

describe('RallyService', () => {
  let service: RallyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RallyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
