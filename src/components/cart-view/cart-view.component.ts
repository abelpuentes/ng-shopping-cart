import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CartItem } from '../../classes/cart-item';
import { CartService } from '../../services/cart.service';
import { CartViewDisplay } from '../../types';

/**
 * Renders a view of the cart.
 */
@Component({
  selector: 'cart-view',
  templateUrl: './cart-view.component.html',
})
export class CartViewComponent implements OnInit, OnDestroy {
  private serviceSubscription: any;
  /**
   * Changes the appearance how the cart view displays in different screen sizes
   * @type {CartViewDisplay}
   */
  @Input() display: CartViewDisplay = 'fixed';
  /**
   * Whether to include images in the cart or not.
   * @type {boolean}
   */
  @Input() images = true;
  /**
   * The text to show when the cart has no items in it.
   * @type {string}
   */
  @Input() emptyText = 'Your cart is empty';
  /**
   * The text to display in the header of the name column.
   * @type {string}
   */
  @Input() nameHeaderText = 'Name';
  /**
   * The text to display in the header of the quantity column.
   * @type {string}
   */
  @Input() quantityHeaderText = 'Quantity';
  /**
   * The text to display in the header of the price column.
   * @type {string}
   */
  @Input() priceHeaderText = 'Price';
  /**
   * The text to display in the header of the total per item column.
   * @type {string}
   */
  @Input() totalHeaderText = 'Total';
  /**
   * The text to display in the tax section of the footer.
   * @type {string}
   */
  @Input() taxFooterText = 'Tax';
  /**
   * The text to display in the shipping section of the footer.
   * @type {string}
   */
  @Input() shippingFooterText = 'Shipping';
  /**
   * The text to display in the total section of the footer.
   * @type {string}
   */
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
