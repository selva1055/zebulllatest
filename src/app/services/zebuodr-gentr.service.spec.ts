import { TestBed } from '@angular/core/testing';

import { ZebuodrGentrService } from './zebuodr-gentr.service';

describe('ZebuodrGentrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZebuodrGentrService = TestBed.get(ZebuodrGentrService);
    expect(service).toBeTruthy();
  });
});
