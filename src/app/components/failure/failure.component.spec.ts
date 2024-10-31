import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailureComponent } from './failure.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('FailureComponent', () => {
  let component: FailureComponent;
  let fixture: ComponentFixture<FailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FailureComponent],
      providers: [
        provideHttpClient(), 
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
