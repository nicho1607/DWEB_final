import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  contact = {
    name: '',
    lastName: '',
    landline: '',
    celular: '',
    email: ''
  };

  editPopupVisible = false;
  deletePopupVisible = false;

  editarContacto = {
    name: '',
    lastName: '',
    landline: '',
    celular: '',
    email: ''
  };

  contactos: any[] = [];

  selectedContactIndex: number | null = null;
  contactToDeleteIndex: number | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(){
    this.loadContacts();
  }

  logOut(){
    sessionStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT', e);
      return null;
    }
  }

  createContact(){
    if(this.contact.name &&
      this.contact.lastName &&
      this.contact.landline &&
      this.contact.celular &&
      this.contact.email){

      const token = sessionStorage.getItem('token');

      if(!token){
        alert('Not logged in');
        return;
      }

      const decoded = this.parseJwt(token);
      const userId = decoded ? decoded.sub : null;

      if(!userId){
        alert('Invalid token');
        return;
      }

      const body = {
        userId: userId,
        name: this.contact.name,
        lastName: this.contact.lastName,
        landline: this.contact.landline,
        celular: this.contact.celular,
        email: this.contact.email
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      const url = 'http://localhost:6542/api/contact/create';
      
      this.http.post(url, body, {headers}).subscribe({
        next: (resp: any) => {
          alert('Contact added');
          this.contactos.push(resp);
          this.loadContacts();
          this.contact = {
            name: '',
            lastName: '',
            landline: '',
            celular: '',
            email: ''
          };
        },
        error: err => {
          console.error(err);
        }
      });     
    }else{
      alert('Please fill all fields');
    }
  }

  loadContacts(){
    const token = sessionStorage.getItem('token');

    if(!token){
      alert('Not logged in');
      return;
    }

    const decoded = this.parseJwt(token);
    const userId = decoded ? decoded.sub : null;

    if(!userId){
      alert('Invalid token');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${token}`
    });

    const url = `http://localhost:6542/api/contact/find/${userId}`;

    this.http.get<any>(url, {headers}).subscribe({
      next: (resp) => {
        this.contactos = resp.contacts;
      },
      error:(err) =>{
        console.error('Error loading contacts:', err);
      }
    });
  }

  popupModifyContact(contact: any, index: number){
    this.editarContacto = { ...contact };
    this.selectedContactIndex = index;
    this.editPopupVisible = true;
    this.deletePopupVisible = false;
  }

  modifyContact(){
    if(this.selectedContactIndex !== null){
      if (this.editarContacto.name &&
        this.editarContacto.lastName &&
        this.editarContacto.landline &&
        this.editarContacto.celular &&
        this.editarContacto.email
      ) {
        const token = sessionStorage.getItem('token');
        if (!token) {
          alert('Not logged in');
          return;
        }

        const decoded = this.parseJwt(token);
        const userId = decoded ? decoded.sub : null;

        if (!userId) {
          alert('Invalid token');
          return;
        }

        const contactoId = this.contactos[this.selectedContactIndex]._id;
        
        const body = {
          userId: userId,
          name: this.editarContacto.name,
          lastName: this.editarContacto.lastName,
          landline: this.editarContacto.landline,
          celular: this.editarContacto.celular,
          email: this.editarContacto.email
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        });

        const url = `http://localhost:6542/api/contact/edit/${contactoId}`

        this.http.put(url, body, {headers}).subscribe({
          next: (res: any) => {
            alert('Contact modified');
            this.loadContacts();
            this.contactos[this.selectedContactIndex!] = res;
            this.editPopupVisible = false;
            this.selectedContactIndex = null;

            this.editarContacto = {
              name: '',
              lastName: '',
              landline: '',
              celular: '',
              email: ''
            };
          },
          error: (err) => {
            console.error('Error modifying contact:', err);
            alert('Error modifying contact');
          }
        });
      } else {
        alert('Please fill all fields to modify the contact');
      }
    }
  }

  closePopup(){
    this.editPopupVisible = false;
  }

  popupDeleteContact(index: number){
    this.contactToDeleteIndex = index;
    this.deletePopupVisible = true;
    this.editPopupVisible = false;
  }

  deleteContact(){
    if(this.contactToDeleteIndex !== null){
      const token = sessionStorage.getItem('token');
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const decoded = this.parseJwt(token);
      const userId = decoded ? decoded.sub : null;

      if (!userId) {
        alert('Invalid token');
        return;
      }

      const contactoId = this.contactos[this.contactToDeleteIndex]._id;

      const url = `http://localhost:6542/api/contact/delete/${contactoId}`;

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      });

      this.http.delete(url, { headers }).subscribe({
        next: () => {
          alert('Contact deleted successfully');
          this.deletePopupVisible = false;
          this.contactToDeleteIndex = null;
          this.loadContacts();
        },
        error: (err) => {
          console.error('Error deleting contact:', err);
        }
      });
    }
  }

  cancelDeleteContact(){
    this.deletePopupVisible = false;
    this.contactToDeleteIndex = null;
  }
}
