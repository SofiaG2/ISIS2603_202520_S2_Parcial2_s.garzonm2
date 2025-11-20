import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Movie } from '../Movie';
import { MovieService } from '../movie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
 selector: 'app-movie-detail',
 standalone: false,
 templateUrl: './movie-detail.component.html',
 styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit, OnChanges {
  @Input() movie: any;
  safeTrailerUrl: SafeResourceUrl | null = null;
  movieDetail: Movie | null = null;
  constructor(
    private sanitizer: DomSanitizer,
    private movieService: MovieService,
    private route: ActivatedRoute
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.updateTrailerUrl();
  }
ngOnInit(): void {
 const id = this.route.snapshot.paramMap.get('id');
   if (id) {
    this.movieService.getMovieDetail(Number(id)).subscribe(
      (data) => {
        this.movieDetail = data;
        this.updateTrailerUrl();
      },
      (error) => {
      console.error('Error al cargar el detalle de la receta:', error);
       }
      );
    }
  }
    private updateTrailerUrl(): void {
    if (this.movieDetail?.trailer_url) {
      // Convertir URL de YouTube watch a embed si es necesario
      let embedUrl = this.movieDetail.trailer_url;
      if (embedUrl.includes('watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/');
      }
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } else {
      this.safeTrailerUrl = null;
    }
  }
}
