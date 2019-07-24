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

`cdkDropList`用来展示列表拖动, `drop(event)`用来监控拖拽事件
eg:

```html
<div cdkDropList class="example-list" (cdkDropListDropped)="drop($event)">
  <div class="example-box" *ngFor="let movie of movies" cdkDrag>{{movie}}</div>
</div>
```

`cdkDropListConnectedTo`可用于多个列表转换，用于指定转换连接指定的`listData`,指令为`cdkDropListData`
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

### vue.draggable

基于`Sortable.js`实现的在 vue 中使用的拖拽插件

`list`也是用于简单的列表展示，`disabled`用于指定可否被拖拽，`move`用于拖动事件

```js
<template>
  <div class="row">
    <div class="col-6">
      <h3>Draggable {{ draggingInfo }}</h3>
      <draggable
        :list="list"
        :disabled="!enabled"
        class="list-group"
        ghost-class="ghost"
        :move="checkMove"
        @start="dragging = true"
        @end="dragging = false"
      >
        <div
          class="list-group-item"
          v-for="element in list"
          :key="element.name"
        >
          {{ element.name }}
        </div>
      </draggable>
    </div>
    <rawDisplayer class="col-3" :value="list" title="List" />
  </div>
</template>
<script>
  components: {
    draggable
  },
  data() {
    return {
      enabled: true,
      list: [
        { name: "John", id: 0 },
        { name: "Joao", id: 1 },
        { name: "Jean", id: 2 }
      ],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
    }
  }
</script>
```

`group`可指定两列拖拽属性

`:group="{ name: 'people', pull: 'clone', put: false }"`

- name 指定列名
- pull 指定拖属性 克隆、true/fale
- put 指定收 是否接收等

```html
<div class="col-3">
  <h3>Draggable 1</h3>
  <draggable
    class="dragArea list-group"
    :list="list1"
    :group="{ name: 'people', pull: 'clone', put: false }"
    :clone="cloneDog"
    @change="log"
  >
    <div class="list-group-item" v-for="element in list1" :key="element.id">
      {{ element.name }}
    </div>
  </draggable>
</div>
```

`handle="classname"` 指定手柄()

`draggable="classname"`可拖拽项

`slot` 插槽

`<transition-group>`指定动画效果

```html
<div>
  <draggable
    class="list-group"
    tag="ul"
    v-model="list"
    v-bind="dragOptions"
    @start="drag = true"
    @end="drag = false"
  >
    <transition-group type="transition" :name="!drag ? 'flip-list' : null">
      <li class="list-group-item" v-for="element in list" :key="element.order">
        <i
          :class="
                  element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                "
          @click="element.fixed = !element.fixed"
          aria-hidden="true"
        ></i>
        {{ element.name }}
      </li>
    </transition-group>
  </draggable>
</div>
```

`nested` 嵌套，也是目前 wizard 拓扑图目前所用到的

对比三种不同框架所实现的拖拽功能，可以看到 angular API 最为清晰，每一项都代表一项功能，没有嵌套，vue 功能最为使用，是由于其基于`sortanle.js`，wizard 目前的拖动主要已树形结构的嵌套为主，react 由于 HOC 原因会有量嵌套而显得不直观。

所以一个比较全面的拖拽组件应该包含如下功能：

| API           | type               | fucntion           |
| ------------- | ------------------ | ------------------ |
| candrag       | boolean            | 整个内容能否被拖拽 |
| disable       | boolean            | 单独项的拖拽       |
| disableSort   | boolean            | 列表排序           |
| clone         | boolean            | 是否是克隆元素     |
| connect       | string/other       | 多个 list 时候连接 |
| handle        | classname/element  | 手柄点击区域       |
| transition    | css info           | 过度效果           |
| boundary      | classname/element  | 边界               |
| diretion      | x/y                | 指定方向           |
| predicateData | ()=>{return value} | 期待接收的值       |
| nested        | ?                  | 嵌套               |
