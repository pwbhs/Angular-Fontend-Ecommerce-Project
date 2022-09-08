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

                                  // return type
  getProduct(theProductId: number): Observable<Product> {
    
    // need to build Url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`

    return this.httpClient.get<Product>(productUrl)
  }


  // return an observable
  // Map the JSON data from Spring Data REST to Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on catrgory id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
  }


  getProductListPaginate(thePage: number, 
                        thePageSize: number,
                        theCategoryId: number): Observable<GetResponseProducts> {

    // need to build URL based on catrgory id, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}` 

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  searchProducts(theKeyword: string) {

    // need to build URL based on keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`

    return this.getProducts(searchUrl);
  } 


  searchProductsPaginate(thePage: number,
                            thePageSize: number,
                            theKeyword: string): Observable<GetResponseProducts> {

    // need to build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                    + `&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }


  // Pass the data to the back-end REST
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }


  getProductCategories(): Observable<ProductCategory[]> {

    // call REST API by Url
    // return an observable
    // Maps the JSON data from Spring Data REST to ProductCategory array
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }

}

// unwraps the JSON from Spring Data REST _embbedded entry

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page:{
    // size of page
    // Grand total of all elements in the db, but not return them, only count.
    // Total pages avaliable
    // current page number
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
