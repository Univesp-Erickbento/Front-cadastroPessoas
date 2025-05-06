
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.css']
})
export class ListaProdutosComponent implements OnInit {
  produtos: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:9091/api/produtos')
      .subscribe(data => {
        this.produtos = data;
      });
  }

  getImagemUrl(imagemPath: string): string {
    return imagemPath.startsWith('http') 
      ? imagemPath 
      : `http://localhost:9091/${imagemPath}`;
  }

  onImageClick(id: number): void {
    this.router.navigate([`/produto/${id}`]);
  }
}
