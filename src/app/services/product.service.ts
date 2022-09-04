import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // REST API Url
  private baseUrl = 'http://localhost:8080/api/products';
  
  private categoryUrl = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  // return an observable
  // Map the JSON data from Spring Data REST to Product array
  getProductList(theCategoryId: number): Observable<Product []> {

    // need to build URL based on catrgory id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response =>  response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    
    // call REST API by Url
    // return an observable
    // Maps the JSON data from Spring Data REST to ProductCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response =>  response._embedded.productCategory)
    );

  }

}

// unwraps the JSON from Spring Data REST _embbedded entry

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
