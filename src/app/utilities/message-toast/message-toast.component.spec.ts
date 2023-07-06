import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageToastComponent } from './message-toast.component';

xdescribe('MessageToastComponent', () => {
  let component: MessageToastComponent;
  let fixture: ComponentFixture<MessageToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageToastComponent]
    });
    fixture = TestBed.createComponent(MessageToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
