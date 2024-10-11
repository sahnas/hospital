import { Input, OnChanges, SimpleChanges, Directive } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

export interface ItemInterface<T> {
  getIconForItem(item: T): string;
  getItemClass(item: T): string;
  getItemName(item: T): string;
}

@Directive()
export abstract class BaseListComponent<T> implements OnChanges {
  @Input() items: T[] = [];
  @Input() isLoading: boolean = false;

  uniqueItems: T[] = [];

  abstract itemInterface: ItemInterface<T>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items']) {
      this.updateUniqueItems();
    }
  }

  updateUniqueItems() {
    this.uniqueItems = Array.from(new Set(this.items));
  }

  getItemCount(item: T): number {
    return this.items.filter(i => i === item).length;
  }

  getIconForItem(item: T): string {
    return this.itemInterface.getIconForItem(item);
  }

  getItemClass(item: T): string {
    return this.itemInterface.getItemClass(item);
  }

  getItemName(item: T): string {
    return this.itemInterface.getItemName(item);
  }

  onItemClick(item: T) {
    console.log(`Clicked on ${this.getItemName(item)}`);
  }

  static fadeInAnimation = trigger('fadeIn', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms', style({ opacity: 1 })),
    ]),
  ]);
}