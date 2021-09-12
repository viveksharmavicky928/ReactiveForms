import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { CustomValidator } from '../shared/custom.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { IEmployee } from './IEmployee';
import { ISkill } from './ISkill';

@Component({
  selector: 'app-create-employees',
  templateUrl: './create-employees.component.html',
  styleUrls: ['./create-employees.component.css']
})
export class CreateEmployeesComponent implements OnInit {

  employeeForm: FormGroup;
  skillArrayLength: number;
  pageTitle: string;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters',
      'maxlength': 'Full Name must be less than 10 characters'
    },
    'email': {
      'required': 'Email is required',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required',
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email donot match',
    },
    'phone': {
      'required': 'Phone is required'
    }
    // 'skillName': {
    //   'required': 'Skill Name is required'
    // },
    // 'experienceInYears': {
    //   'required': 'Experience is required'
    // },
    // 'proficiency': {
    //   'required': 'Proficiency is required'
    // },
  }

  formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': ''
    // 'skillName': '',
    // 'experienceInYears': '',
    // 'proficiency': ''
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private employeeService: EmployeeService, private router: Router) { }
  employee: IEmployee;

  // ngOnInit(): void {
  //   this.employeeForm = new FormGroup({
  //     fullName: new FormControl(),
  //     email: new FormControl(),
  //     skills : new FormGroup({
  //       skillName : new FormControl(),
  //       experienceInYears : new FormControl(),
  //       proficiency : new FormControl()
  //     })
  //   })
  // }

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, CustomValidator.emailDomain('gmail.com')]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),
      phone: [''],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = 'Edit Employee';
        this.getEmployee(empId);
      } else {
        this.pageTitle = 'Create Employee';
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    });

    // this.employeeForm.get('fullName').valueChanges.subscribe((value : string) => {
    //   console.log(value.length);
    // })

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
    })

    this.employeeForm.get('contactPreference').valueChanges.subscribe(data => {
      this.onContactPreferenceChange(data);
    })
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    });
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneFormControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      phoneFormControl.setValidators(Validators.required);
    } else {
      phoneFormControl.clearValidators();
    }
    phoneFormControl.updateValueAndValidity();
  }

  isSkillArrayLengthGreaterThan(): boolean {
    this.skillArrayLength = (<FormArray>this.employeeForm.get('skills')).length;
    if (this.skillArrayLength > 1) {
      return true;
    }
    else {
      return false;
    }
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id)
      .subscribe(
        (employee: IEmployee) => {
          // Store the employee object returned by the
          // REST API in the employee property
          this.employee = employee;
          this.editEmployee(employee);
        },
        (err: any) => console.log(err)
      );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExistingSkills(employee.skills));
  }

  setExistingSkills(skillSets: ISkill[]): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(s => {
      formArray.push(this.fb.group({
        skillName: s.skillName,
        experienceInYears: s.experienceInYears,
        proficiency: s.proficiency
      }));
    });

    return formArray;
  }



  logValidationErrors(group: FormGroup = this.employeeForm): void {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);

      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + '';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
      // if (abstractControl instanceof FormArray) {
      //   for (const control of abstractControl.controls){
      //     if(control instanceof FormGroup){
      //       this.logValidationErrors(control);
      //     }
      //   }
      // }
    });
  }


  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }

  onClick() {
    //   this.logValidationErrors(this.employeeForm);
    //   console.log(this.formError);
  }

  // onSubmit(): void {
  //   this.mapFormValuesToEmployeeModel();
  //   if (this.employee.id) {
  //     this.employeeService.updateEmployee(this.employee).subscribe(
  //       () => this.router.navigate(['employees']),
  //       (err: any) => console.log(err)
  //     );
  //   } else {
  //     this.employeeService.addEmployee(this.employee).subscribe(
  //       () => this.router.navigate(['employees']),
  //       (err: any) => console.log(err)
  //     );
  //   }
  // }

  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
     this.employeeService.updateEmployee(this.employee);
     this.router.navigate(['employees']);
    } else {
      this.employeeService.addEmployee(this.employee);
      this.router.navigate(['employees']);
    }
  }

  // onSubmit(): void {
  //   const newEmployee: IEmployee = Object.assign({}, this.employee);
  //   this.employeeService.save(newEmployee);
  //   this.employeeForm.reset();
  //   this.router.navigate(['list']);
  // }

  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
  }

}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if (emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  }
  else {
    return { 'emailMismatch': true }
  }
}

