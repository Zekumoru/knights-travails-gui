const boardDOM = document.querySelector('#board');
const board = [];

for (let i = 0; i < 8; i++) {
  const tr = document.createElement('tr');
  const row = [];

  for (let j = 0; j < 8; j++) {
    const td = document.createElement('td');

    row.push(td);
    tr.appendChild(td);
  }

  board.push(row);
  boardDOM.appendChild(tr);
}

export default {
  array: board,
  dom: boardDOM,
};
