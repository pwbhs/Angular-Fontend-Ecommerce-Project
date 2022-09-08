import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
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
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = ""


  // inject ProductService
  // inject the ActivatedRoute
  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService) { }

  // similar to @PostConstruct
  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    });
  }

  // method is invoked once you "subscribe"
  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword')

    if(this.searchMode){
      this.handleSearchProducts()
    }else{
      this.handleListProducts()
    }
      
  }

  handleSearchProducts() {
  
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!
    
    // if we have a different keyword than previous
    // then set thePageNumber to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1
    }

    this.previousKeyword = theKeyword

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)


    // now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                  this.thePageSize,
                                                  theKeyword).subscribe(this.processResult())
    
  
  }

  handleListProducts() {

    // check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if (hasCategoryId) {
      // get the "id" para string. convert string to a number using the '+' symbol
      this.currentCategoryId = + this.route.snapshot.paramMap.get('id')!
    } else {
      // not category id avaliable .. default to category id 1
      this.currentCategoryId = 1
    }

    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have a different category id then previous
    // the set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1
    }

    this.previousCategoryId = this.currentCategoryId
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)

    // now get the products for the given category id
    // **Angular pagination component are 1 based, spring data REST are 0 based
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult()
                                                // LHS are properties defined in this class
                                                // RHS is data from Spring Data REST JSON
                                                // Same as processResult()
                                                // data => {
                                                //   this.products = data._embedded.products
                                                //   this.thePageNumber = data.page.number + 1
                                                //   this.thePageSize = data.page.size
                                                //   this.theTotalElements = data.page.totalElements
                                                // }
                                               )

    
    
    // now get the products for the given category id
    // this.productService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     // assign results to the Product array
    //     this.products = data;
    //   }
    // )
  }
                // accept from product-list-component.HTML(users select)
  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize
    this.thePageNumber = 1
    this.listProducts()
  
  }


  processResult(){
    return (data: any) => {
      this.products = data._embedded.products
      this.thePageNumber = data.page.number + 1
      this.thePageSize = data.page.size
      this.theTotalElements = data.page.totalElements
    }
  }


  addToCart(theProduct: Product) {

    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)

    const theCartItem = new CartItem(theProduct)

    this.cartService.addToCart(theCartItem)

  }

}
