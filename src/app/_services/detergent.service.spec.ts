import { TestBed } from '@angular/core/testing';

import { DetergentService } from './detergent.service';

describe('DetergentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetergentService = TestBed.get(DetergentService);
    expect(service).toBeTruthy();
  });
});
