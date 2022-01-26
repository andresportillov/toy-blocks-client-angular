import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Node } from '../../models/node.model';
import { Block } from 'src/models/block.model';

@Component({
  selector: 'app-node-item',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent {
  @Input() node: Node;
  @Input() block: Block;
  @Output() ToogleExpand = new EventEmitter<Node>();
  @Input() expanded: boolean;

  handleToogleExpand(node: Node): void {
    this.ToogleExpand.emit(node);
  }
}
