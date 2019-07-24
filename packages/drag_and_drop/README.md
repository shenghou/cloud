# 拖拽组件封装

目标： 基于 `React dnd`封装一个通用拖拽组件供 wizard ui 使用

### React DnD API

`DragDropContext(backend)` 拖拽上下文，将根组件包裹在`DragDropContext`使其注入拖拽插件

- `backend` 实现 DnD 的方式， 默认是用 `HTML5 DnD API`，不能用于触屏环境

`DragSource(type, spec, collect)` 可以被拖动的资源，即拖动源

`DropTarget(type, spec, collect)` 可以接受拖动的资源，即接受源

- `type` 定义拖拽的类型，只有相同类型的才可以被拖拽
- `spec` 定义拖放事件的 js 对象
  - `beginDrag(props, monitor, component):Required`
  - `endDrag(props, monitor, component): Optional`
  - `canDrag(props, monitor): Optional`
  - `isDragging(props, monitor): Optional`
- `collect` 连接
  - `connect`: `DragSourceConnector`的实例，连接 DOM 节点到
  - `monitor`: `DragSourceMonitor`的实例，用于查看当前拖状态信息

可以看到 React DnD API 主要包含注册插件函数、可拖动资源、可接受资源三类，其中对于资源的拖动可进一步分为类型、资源控制、连接

### angular material drag and drop

`DragDropModule`是 angular 自带的拖拽模块

通过将`cdkDrag`指令注入到页面元素就可以使其具有拖动功能。
eg:

```html
<div class="example-box" cdkDrag>
  Drag me around
</div>
```

对于列表其直接提供了`cdkDropList`来展示列表拖动, `drop(event)`用来监控拖拽事件
eg:

```html
<div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
  <div class="example-box" *ngFor="let movie of movies" cdkDrag>{{movie}}</div>
</div>
```

多个列表间转换提供`cdkDropListConnectedTo`用于指定转换连接指定的`listData`,指令为`cdkDropListData`
eg:

```html
<div class="example-container">
  <h2>To do</h2>
  <div
    cdkDropList
    #todoList="cdkDropList"
    [cdkDropListData]="todo"
    [cdkDropListConnectedTo]="[doneList]"
    class="example-list"
    (cdkDropListDropped)="drop($event)"
  >
    <div class="example-box" *ngFor="let item of todo" cdkDrag>{{item}}</div>
  </div>
</div>
<div class="example-container">
  <h2>Done</h2>
  <div
    cdkDropList
    #doneList="cdkDropList"
    [cdkDropListData]="done"
    [cdkDropListConnectedTo]="[todoList]"
    class="example-list"
    (cdkDropListDropped)="drop($event)"
  >
    <div class="example-box" *ngFor="let item of done" cdkDrag>{{item}}</div>
  </div>
</div>
```

```ts
export class CdkDragDropConnectedSortingExample {
  todo = ["Get to work", "Pick up groceries", "Go home", "Fall asleep"];

  done = ["Get up", "Brush teeth", "Take a shower", "Check e-mail", "Walk dog"];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
```

`cdkDragHandle`来使用更细节的控制面积,使用手柄控制
eg:

```html
<div class="example-box" cdkDrag>
  I can only be dragged using the handle
  <div class="example-handle" cdkDragHandle>
    <svg width="24px" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"
      ></path>
      <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
  </div>
</div>
```

`*cdkDragPreview`用来预览显示,有时拖拽时候不一定就是想显示所拖拽的内容
eg:

```html
<div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
  <div class="example-box" *ngFor="let movie of movies" cdkDrag>
    {{movie.title}}
    <img *cdkDragPreview [src]="movie.poster" [alt]="movie.title" />
  </div>
</div>
```

`*cdkDragPlaceholder`用于给拖拽的元素指定占位符，而不显示 clone 的元素

eg:

```html
<div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
  <div class="example-box" *ngFor="let movie of movies" cdkDrag>
    <div class="example-custom-placeholder" *cdkDragPlaceholder></div>
    {{movie}}
  </div>
</div>
```

`cdkDragBoundary`用于限定拖拽区域，超出该区域的将被限制
eg:

```html
<div class="example-boundary">
  <div class="example-box" cdkDragBoundary=".example-boundary" cdkDrag>
    I can only be dragged within the dotted container
  </div>
</div>
```

`cdkDragLockAxis`用于限定在某个坐标轴上拖到情况
eg:

```html
<div class="example-box" cdkDragLockAxis="y" cdkDrag>
  I can only be dragged up/down
</div>
<div class="example-box" cdkDragLockAxis="x" cdkDrag>
  I can only be dragged left/right
</div>
```

`cdkDragRootElement`可被用于那些现在页面没有的元素点击后才显示的元素
eg:

```html
<button (click)="openDialog()">Open a draggable dialog</button>
<ng-template>
  <div
    class="example-dialog-content"
    cdkDrag
    cdkDragRootElement=".cdk-overlay-pane"
  >
    Drag the dialog around!
  </div>
</ng-template>
```

`cdkDropListEnterPredicate`可被用于更细粒度的控制，对于接受条件返回`false`的可以不让受入
eg:

```html
<div class="example-container">
  <h2>Available numbers</h2>

  <div
    id="all"
    cdkDropList
    [cdkDropListData]="all"
    cdkDropListConnectedTo="even"
    class="example-list"
    (cdkDropListDropped)="drop($event)"
    [cdkDropListEnterPredicate]="noReturnPredicate"
  >
    <div
      class="example-box"
      *ngFor="let number of all"
      [cdkDragData]="number"
      cdkDrag
    >
      {{number}}
    </div>
  </div>
</div>
<div class="example-container">
  <h2>Even numbers</h2>
  <div
    id="even"
    cdkDropList
    [cdkDropListData]="even"
    cdkDropListConnectedTo="all"
    class="example-list"
    (cdkDropListDropped)="drop($event)"
    [cdkDropListEnterPredicate]="evenPredicate"
  >
    <div
      class="example-box"
      *ngFor="let number of even"
      cdkDrag
      [cdkDragData]="number"
    >
      {{number}}
    </div>
  </div>
</div>
```

```ts
export class CdkDragDropEnterPredicateExample {
  all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  even = [10];

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<number>) {
    return item.data % 2 === 0;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return false;
  }
}
```

`cdkDragDisabled`提供了禁止拖拽选项
eg:

```html
<div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
  <div
    class="example-box"
    *ngFor="let item of items"
    cdkDrag
    [cdkDragDisabled]="item.disabled"
  >
    {{item.value}}
  </div>
</div>
```

`cdkDropListSortingDisabled`用于禁止排序，适用于有顺序的场景
eg:

```html
<div cdkDropListGroup>
  <div class="example-container">
    <h2>Available items</h2>
    <div
      cdkDropList
      [cdkDropListData]="items"
      class="example-list"
      cdkDropListSortingDisabled
      (cdkDropListDropped)="drop($event)"
    >
      <div class="example-box" *ngFor="let item of items" cdkDrag>{{item}}</div>
    </div>
  </div>
  <div class="example-container">
    <h2>Shopping basket</h2>
    <div
      cdkDropList
      [cdkDropListData]="basket"
      class="example-list"
      (cdkDropListDropped)="drop($event)"
    >
      <div class="example-box" *ngFor="let item of basket" cdkDrag>
        {{item}}
      </div>
    </div>
  </div>
</div>
```

`cdkDragStartDelay`对于触控屏可用于防止误触而导致的拖动
eg:

```html
<div class="example-box" cdkDrag [cdkDragStartDelay]="1000">
  Dragging starts after one second
</div>
```
