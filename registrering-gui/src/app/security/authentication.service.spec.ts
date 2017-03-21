import {TestBed, inject} from "@angular/core/testing";
import {AuthenticationServiceService} from "./authentication.service";

describe('AuthenticationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationServiceService]
    });
  });

  it('should ...', inject([AuthenticationServiceService], (service: AuthenticationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
