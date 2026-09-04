import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { App } from './app';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('App', () => {
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiBaseUrl + '/courses';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),         // registers HttpClient for injection
        provideHttpClientTesting(),  // swaps in the mock backend, must come AFTER provideHttpClient()
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // fails the test if any expected request was never fired/flushed
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    fixture.detectChanges(); // triggers ngOnInit -> fires getAllCourses() -> now the request exists

    const req = httpMock.expectOne(apiUrl);
    req.flush([]);

    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); // runs ngOnInit, fires the GET request

    const req = httpMock.expectOne(apiUrl);
    req.flush([{ title: 'Angular Basics', description: 'Intro course' }]); // fake response, resolves instantly

    fixture.detectChanges(); // re-render now that the courses signal is set
    const h4 = fixture.nativeElement.querySelector('h4');
    expect(h4.textContent).toContain('ci: fix summary table markdown');
  });

  it('should render course rows from the API response', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const req = httpMock.expectOne(apiUrl);
    req.flush([{ title: 'Angular Basics', description: 'Intro course' }]);

    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Angular Basics');
  });
});