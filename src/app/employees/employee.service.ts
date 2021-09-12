import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

@Injectable()
export class EmployeeService {
    baseUrl = 'http://localhost:3000/employees';
    constructor(private httpClient: HttpClient) {
    }

    private listEmployees: IEmployee[] = [
        {
            id: 1,
            fullName: "Mark",
            contactPreference: "email",
            email: "mark@email.com",
            phone: 5641238971,
            skills: [
                {
                    skillName: "C#",
                    experienceInYears: 1,
                    proficiency: "beginner"
                },
                {
                    skillName: "Java",
                    experienceInYears: 2,
                    proficiency: "intermediate"
                }
            ]
        },
        {
            id: 2,
            fullName: "John",
            contactPreference: "phone",
            email: "john@email.com",
            phone: 3242138971,
            skills: [
                {
                    skillName: "Angular",
                    experienceInYears: 2,
                    proficiency: "beginner"
                },
                {
                    skillName: "HTML",
                    experienceInYears: 2,
                    proficiency: "intermediate"
                },
                {
                    skillName: "LINQ",
                    experienceInYears: 3,
                    proficiency: "advanced"
                }
            ]
        }
    
      ];

      getEmployees(): Observable<IEmployee[]> {
        return of(this.listEmployees);
      }

    // getEmployees(): Observable<IEmployee[]> {
    //     return this.httpClient.get<IEmployee[]>(this.baseUrl)
    //         .pipe(catchError(this.handleError));
    // }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse.error instanceof ErrorEvent) {
            console.error('Client Side Error :', errorResponse.error.message);
        } else {
            console.error('Server Side Error :', errorResponse);
        }
        return throwError('There is a problem with the service. We are notified & working on it. Please try again later.');
    }

    getEmployee(id : number): Observable<IEmployee> {
        return of(this.listEmployees.find(e => e.id === id));
      }

    // getEmployee(id: number): Observable<IEmployee> {
    //     return this.httpClient.get<IEmployee>(`${this.baseUrl}/${id}`)
    //         .pipe(catchError(this.handleError));
    // }

    // addEmployee(employee: IEmployee): Observable<IEmployee> {
    //     return this.httpClient.post<IEmployee>(this.baseUrl, employee, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    //     .pipe(catchError(this.handleError));
    // }

     addEmployee(employee: IEmployee) : void{
        this.listEmployees.push(employee);
    }

    
    // updateEmployee(employee: IEmployee): Observable<void> {
    //     return this.httpClient.put<void>(`${this.baseUrl}/${employee.id}`, employee, {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/json'
    //         })
    //     })
    //         .pipe(catchError(this.handleError));
    // }

      updateEmployee(employee: IEmployee): void {
        const lastIndex = this.listEmployees.findIndex(
            (list) => list.id === employee.id
          )
       this.listEmployees[lastIndex] = employee;
       console.log(this.listEmployees[lastIndex]);
    }

    deleteEmployee(id: number): Observable<void> {
        return this.httpClient.delete<void>(`${this.baseUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }
}