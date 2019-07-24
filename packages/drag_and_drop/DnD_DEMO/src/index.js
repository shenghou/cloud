import React, { useState } from "react";
import ReactDOM from "react-dom";
// import List from "./components/List";
import List from "./components/DndList";

import "./styles.scss";

const defaultList = [
  { id: 1, title: "item1" },
  { id: 2, title: "item2" },
  { id: 3, title: "item3" },
  { id: 4, title: "item4" },
  { id: 5, title: "item5" }
];

function App() {
  const [list, setList] = useState(defaultList);
  const [activeItem, setActiveItem] = useState(list[0]);
  const onDropEnd = (list, fromIndex, toIndex) => {
    setList([...list]);
  };
  const onDelete = list => {
    setList([...list]);
  };
  const onClick = item => {
    if (item.id !== activeItem.id) {
      setActiveItem(item);
    }
  };
  return (
    <div>
      <h4>列表拖动组件</h4>
      <div className="list-wrap">
        <List
          list={list}
          activeItem={activeItem}
          onDropEnd={onDropEnd}
          onDelete={onDelete}
          onClick={onClick}
        />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
