import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../_service/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DebugElement } from '@angular/core';

const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule
];


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let authServiceSpy = jasmine.createSpyObj(AuthService, ['register']);
  authServiceSpy.register.and.returnValue(of());

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule , ...moduleAngularMaterial],
      declarations: [RegisterComponent],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        MatSnackBar,
        provideAnimations()
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      component.ngOnInit();
      fixture.detectChanges();
      de = fixture.debugElement.query(By.css('form'));
      el = de.nativeElement;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create Register component', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    component.myForm.controls['firstName'].setValue('');
    component.myForm.controls['lastName'].setValue('');
    component.myForm.controls['email'].setValue('');
    component.myForm.controls['password'].setValue('');
    component.myForm.controls['confirmPassword'].setValue('');
    expect(component.myForm.valid).toBeFalsy();
  });

  it('firstName field validity', () => {
    const name = component.myForm.controls['firstName'];
    expect(name.valid).toBeFalsy();
    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
  });

  it('lastName field validity', () => {
    const name = component.myForm.controls['lastName'];
    expect(name.valid).toBeFalsy();
    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
  });

  it('email field validity', () => {
    const name = component.myForm.controls['email'];
    expect(name.valid).toBeFalsy();
    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
    name.setValue('invalidemail');
    expect(name.hasError('email')).toBeTruthy();
  });

  it('password field validity', () => {
    const name = component.myForm.controls['password'];
    expect(name.valid).toBeFalsy();
    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
    name.setValue('123@Q');
    expect(name.hasError('pattern')).toBeTruthy();
  });

  it('confirmPassword field validity', () => {
    const name = component.myForm.controls['confirmPassword'];
    expect(name.valid).toBeFalsy();
    name.setValue('');
    expect(name.hasError('required')).toBeTruthy();
    const pass = component.myForm.controls['password'];
    pass.setValue('123@Q');
    name.setValue('123@Qq');
    expect(name.hasError('match')).toBeTruthy();
  });

  it('form should be invalid', () => {
    const formData = {
      "firstName": "John",
      "lastName": "Pitt",
      "email": "invalidemail",
      "password": "123@Qq",
      "confirmPassword": "123@Qq",
      "adminCode": "123"
    };
    component.myForm.setValue(formData);
    component.onSubmit();
    expect(component.myForm.invalid).toEqual(true);
  });

  it('form should be valid', () => {
    component.myForm.controls['firstName'].setValue('John');
    component.myForm.controls['lastName'].setValue('Pitt');
    component.myForm.controls['email'].setValue('something@somewhere.com');
    component.myForm.controls['password'].setValue('123@Qq');
    component.myForm.controls['confirmPassword'].setValue('123@Qq');
    expect(component.myForm.valid).toBeTruthy();
  });

  it('should allow user to register', () => {
    const formData = {
      "firstName": "John",
      "lastName": "Pitt",
      "email": "something@somewhere.com",
      "password": "123@Qq",
      "confirmPassword": "123@Qq",
      "adminCode": "123"
    };
    component.myForm.setValue(formData);
    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith(formData.firstName, formData.lastName, formData.email, formData.password, false);
  });
});
