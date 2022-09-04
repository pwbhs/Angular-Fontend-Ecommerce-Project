import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  // locate to the html file which have <app-product-list> tag
  selector: 'app-product-list',
  // locate to the html file 
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1

  // inject ProductService
  // inject the ActivatedRoute
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  // similar to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    });
  }

  // method is invoked once you "subscribe"
  listProducts(){

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if (hasCategoryId){
      // get the "id" para string. convert string to a number using the '+' symbol
      this.currentCategoryId =+ this.route.snapshot.paramMap.get('id')!
    }else{
      // not category id avaliable .. default to category id 1
      this.currentCategoryId = 1
    }

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        // assign results to the Product array
        this.products = data; 
      }
    )
  }

}
