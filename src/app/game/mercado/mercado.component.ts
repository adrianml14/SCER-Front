import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RallyService } from '../../services/rally.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-mercado',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mercado.component.html',
  styleUrl: './mercado.component.css',
})
export class MercadoComponent implements OnInit {
  private rallyService = inject(RallyService);

  pilotos: any[] = [];
  copilotos: any[] = [];
  coches: any[] = [];

  ngOnInit(): void {
    this.rallyService.getPilotos().subscribe(data => this.pilotos = data);
    this.rallyService.getCopilotos().subscribe(data => this.copilotos = data);
    this.rallyService.getCoches().subscribe(data => this.coches = data);
  }
}
