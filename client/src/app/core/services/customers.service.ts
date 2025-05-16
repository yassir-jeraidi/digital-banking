import {Injectable} from '@angular/core';
import {Customer} from '@core/interfaces/customer';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>('customers');
    }
    getById(id: number): Observable<Customer> {
        return this.http.get<Customer>(`customers/${id}`);
    }
    create(costumer: Customer): Observable<Customer> {
        return this.http.post<Customer>('customers', costumer);
    }
    update(costumer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`customers/${costumer.id}`, costumer);
    }
    delete(id: number): Observable<void> {
        return this.http.delete<void>(`customers/${id}`);
    }


}
