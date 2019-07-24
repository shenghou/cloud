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


