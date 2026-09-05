import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private apiUrl = environment.apiBaseUrl + '/courses';

  //Signal state for courses
  courses = signal<any[]>([]);
  environment = signal<boolean>(environment.production);

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.getAllCourses();

  }

  getAllCourses(): void {
    console.log('API URL:', this.apiUrl);
    this.http.get<any[]>(this.apiUrl).subscribe(
      (courses) => {
        console.log('Courses:', courses);
        this.courses.set(courses);
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }


}
