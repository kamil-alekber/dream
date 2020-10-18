import EE from 'eventemitter3';
import { UrlObject } from 'url';
import { MutableRefObject } from 'react';
type Url = string | UrlObject;

export interface Breadcrumb {
  title: string;
  href?: Url;
  as?: Url;
  ref?: MutableRefObject<any>;
}

export class BreadcrumbEmitter extends EE {
  public breadcrumbs: Breadcrumb[] = [];

  constructor() {
    super();
  }

  addBreadcrumb(data: Breadcrumb) {
    if (data) {
      this.breadcrumbs = [...this.breadcrumbs, data];
      this.emit('change', this.breadcrumbs);
    }
  }

  updateBreadcrumb(data: Breadcrumb) {
    if (data) {
      // Replace the item by index.
      const index = this.breadcrumbs.findIndex((item) => item.ref === data.ref);
      if (index !== -1) {
        this.breadcrumbs[index] = data;
        //  После обновления, создаем новый массив, так как React в useEffect ссылается на старую ссылку масива в памяти и не видит новые данные.
        this.breadcrumbs = [...this.breadcrumbs];
        this.emit('change', this.breadcrumbs);
      }
    }
  }

  removeBreadcrumb(ref: MutableRefObject<any>) {
    if (ref) {
      this.breadcrumbs = this.breadcrumbs?.filter((item) => item.ref !== ref);
      this.emit('change', this.breadcrumbs);
    }
  }

  onChange(cb: (breadcrumbs: Breadcrumb[]) => void) {
    this.on('change', cb);
    return () => {
      this.off('change', cb);
    };
  }
}
