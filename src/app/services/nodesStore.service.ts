import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Store } from './store';
import { Node } from 'src/models/node.model';
import { State } from './state';

@Injectable({
  providedIn: 'root'
})
export class NodesStore extends Store<Node[]> {
  constructor(private api: ApiService) {
    super(new State().list);
  }

  public getStatus() {
    this._getStatus().subscribe((value: any) => {
      this.setState([...value]);
    });
  }

  public _getStatus() {
    const status = this.state.map(node => {
      return this.api.get(`${node.url}/api/v1/status`).pipe(
        catchError(error =>
          of({
            node_name: false
          })
        ),
        map(({ node_name }) => {
          return {
            ...node,
            name: node_name,
            online: !!node_name,
            loading: false
          };
        })
      );
    });

    return forkJoin(status);
  }

  public getBlock() {
    this._getBlock().subscribe((value: any) => {
      this.setState(this.state.map(node => {
        const nodeBlocks = value.find(block => block.node_url === node.url);
        return {
          ...node,
          blocks: nodeBlocks ? nodeBlocks.blocks : []
        };
      }));
    });
  }

  public _getBlock() {
    const block = this.state.map(node => {
      const res = this.api.get(`${node.url}/api/v1/blocks`);
      return res.pipe(
        catchError(error => {
          return of({
            block: false
          });
        }
        ),
        // tslint:disable-next-line: no-shadowed-variable
        map(({data}) => {
          if ( data ) {
            return {
              blocks: data,
              node_url: node.url
            };
          } else {
            return {};
          }
        })
      );
    });
    return forkJoin(block);
  }
}
