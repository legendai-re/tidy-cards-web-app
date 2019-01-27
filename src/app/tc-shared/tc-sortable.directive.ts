import { Directive, ElementRef, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { TcCollectionService }   from '../tc-collection/tc-collection.service';
import { TcCollection }   from '../tc-collection/tc-collection.class';

declare var $: any;

@Directive({ selector: '[tc-sortable]' })
export class TcSortableDirective {

    @Input('ignoreItem') ignoreItem = 0;
    @Input('list') list: any[];
    @Input('ghostClass') ghostClass: string;
    @Output() itemMoved = new EventEmitter();

    private element: HTMLElement;

    constructor(public el: ElementRef, private collectionService: TcCollectionService) {
    }

    ngOnInit() {
        this.element = this.el.nativeElement;
        var elCopy = this.element;
        let newIndex;
        let oldIndex;
        $(this.element).sortable({
            placeholder: this.ghostClass,
            helper: function(x, y){ y.addClass('is-moving'); return y },
            handle: '.collection-card--drag-handle',
            cancel: '.cancel-sort',
            tolerance: "pointer",
            items: "> :not(.not-sortable-item)",
            scroll: false,
            start: (event, ui) => {
                $(this).attr('data-previndex', ui.item.index());
            },
            update: (event, ui) => {
                newIndex = ui.item.index()-this.ignoreItem;
                oldIndex = $(this).attr('data-previndex')-this.ignoreItem;
                $(this).removeAttr('data-previndex');
            },
            stop: (event, ui) => {
                ui.item.removeClass('is-moving');
                let tmpItem = this.list[oldIndex];
                if(!tmpItem)
                    return;

                tmpItem.position = newIndex;
                tmpItem.updatePosition = true;

                this.itemMoved.emit({
                    value: {modifiedItem: tmpItem}
                })

                tmpItem.updatePosition = false;
                this.list.splice(oldIndex,1);
                this.list.splice(newIndex, 0, tmpItem);
                for(let i in this.list){
                    this.list[i].position = i;
                }
            }
        })
    }

}
