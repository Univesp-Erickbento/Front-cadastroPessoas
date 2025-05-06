import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  decoracoes: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.carregarDecoracoes();
  }

  carregarDecoracoes(): void {
    this.http.get<any[]>('http://localhost:9091/api/decoracoes') // Ajuste conforme seu backend
      .subscribe(data => {
        // Garante que o campo imagemUrl será usado no HTML
        this.decoracoes = data.map(item => ({
          ...item,
          imagemUrl: item.fotoPrincipalUrl?.startsWith('http') 
            ? item.fotoPrincipalUrl 
            : `http://localhost:9091/imagens/${encodeURIComponent(item.fotoPrincipalUrl)}`
        }));
      });
  }

  verDetalhes(itemId: number): void {
    this.router.navigate(['/detalhes-decoracao', itemId]);
  }
}
