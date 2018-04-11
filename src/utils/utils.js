import moment from 'moment'
import ReactDOM from 'react-dom'

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function ft(time, simple) {
  const fmtString = simple ? 'YYYY-MM-DD' : 'YYYY年MM月DD日'
  return time ? moment(time).format(fmtString) : '---'
}

/**
 * convert bool to human string
 * @param b {Boolean}
 * @return {String}
 */
export function parseBool(b) {
  return b ? '是' : '否'
}

/**
 * conver stock kind number to string
 * @param s {String}
 * @return {String}
 */
export function parseStock(s) {
  s = parseInt(s, 10)
  if (s === 1) {
    return '限售'
  } else {
    return '流通'
  }
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

export const kRoleMap = ['管理员', '审批者', '操作员', '普通用户']

export function parseRole(role) {
  role = parseInt(role, 10)
  return kRoleMap[role]
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

export function printElement(element) {
  const newWin = window.open('')
  const doc = newWin.document
  doc.body.style.margin = 0
  const node = doc.createElement('div')
  doc.body.appendChild(node)
  ReactDOM.render(element, node)
  newWin.print()
  // newWin.close()
}
