import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CartItem } from '../../classes/cart-item';
import { CartService } from '../../services/cart.service';
import { CartViewDisplay } from '../../types';

@Component({
  selector: 'cart-view',
  templateUrl: './cart-view.component.html',
})
export class CartViewComponent implements OnInit, OnDestroy {
  private serviceSubscription: any;
  @Input() display: CartViewDisplay = 'fixed';
  @Input() images = true;
  @Input() emptyText = 'Your cart is empty';
  @Input() nameHeaderText = 'Name';
  @Input() quantityHeaderText = 'Quantity';
  @Input() priceHeaderText = 'Price';
  @Input() totalHeaderText = 'Price';
  @Input() taxFooterText = 'Tax';
  @Input() shippingFooterText = 'Shipping';
  @Input() totalFooterText = 'Total';
  empty = true;
  items: CartItem[];
  taxRate = 0;
  tax = 0;
  shipping = 0;
  cost = 0;

  constructor(private cartService: CartService<any>) {

  }

  update() {
    this.empty = this.cartService.isEmpty();
    this.items = this.cartService.getItems();
    this.taxRate = this.cartService.getTaxRate();
    this.tax = this.cartService.getTax();
    this.shipping = this.cartService.getShipping();
    this.cost = this.cartService.totalCost();
  }

  increase(item: CartItem) {
    item.setQuantity(item.getQuantity() + 1);
    this.cartService.addItem(item);
  }

  decrease(item: CartItem) {
    if (item.getQuantity() > 1) {
      item.setQuantity(item.getQuantity() - 1);
      this.cartService.addItem(item);
    } else {
      this.cartService.removeItem(item.getId());
    }
  }

  ngOnInit(): void {
    this.update();
    this.serviceSubscription = this.cartService.onItemsChanged.subscribe(() => {
      this.update();
    });
  }

  ngOnDestroy(): void {
    this.serviceSubscription.unsubscribe();
  }

}
