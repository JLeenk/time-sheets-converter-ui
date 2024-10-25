import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrl: './failure.component.css'
})
export class FailureComponent implements OnInit{
  failMessage :string | null = '';

constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        this.failMessage = params['failMessage'];
      });
  }

}
