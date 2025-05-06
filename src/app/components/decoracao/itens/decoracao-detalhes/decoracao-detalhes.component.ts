import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-decoracao-detalhes',
  templateUrl: './decoracao-detalhes.component.html',
  styleUrls: ['./decoracao-detalhes.component.css']
})
export class DecoracaoDetalhesComponent implements OnInit {
  item: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get(`http://localhost:9091/api/produtos/${id}`)
        .subscribe(data => {
          this.item = data;
        });
    }
  }

  getImagemUrl(imagemPath: string): string {
    return imagemPath.startsWith('http') 
      ? imagemPath 
      : `http://localhost:9091/${imagemPath}`;
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível';
  }

  onBackClick(): void {
    this.router.navigate(['/produtos']);
  }
}
