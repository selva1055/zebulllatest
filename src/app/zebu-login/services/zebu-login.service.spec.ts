import { TestBed } from '@angular/core/testing';

import { ZebuLoginService } from './zebu-login.service';

describe('ZebuLoginService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZebuLoginService = TestBed.get(ZebuLoginService);
    expect(service).toBeTruthy();
  });
});
