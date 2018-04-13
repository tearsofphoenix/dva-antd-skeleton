import moment from 'moment'
import ReactDOM from 'react-dom'

export function ft(time, simple) {
  const fmtString = simple ? 'YYYY-MM-DD' : 'YYYY年MM月DD日'
  return time ? moment(time).format(fmtString) : '---'
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}
