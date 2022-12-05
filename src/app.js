import '@mdi/font/css/materialdesignicons.css';
import 'normalize.css';
import './style.css';
import { KnightGraph } from '@zekumoru-dev/knights-travails';
import board from './scripts/board';

class TraversalEvent {
  constructor(type, node) {
    this.type = type;
    this.node = node;
  }
}

const traversals = [];

const graph = new KnightGraph();
const paths = graph.findPath([3, 3], [4, 3], {
  onTraversal: (node) => traversals.push(new TraversalEvent('traversal', node)),
  onQueued: (node) => traversals.push(new TraversalEvent('queue', node)),
  onDequeued: (node) => traversals.push(new TraversalEvent('dequeue', node)),
});

board.array[3][3].style.backgroundColor = 'blue';
board.array[4][3].style.backgroundColor = 'green';

document.querySelector('button').addEventListener('click', (e) => {
  start();
  e.target.remove();
});

function start() {
  new Promise((resolve) => {
    const previousNodes = [];
    let current = 0;
    let previousNeighbors = [];

    const interval = setInterval(() => {
      const traversal = traversals[current];
      const { row, col } = traversal.node;

      if (traversal.type === 'traversal') {
        console.log(`Dequeue node [${col}, ${row}]`);

        if (previousNodes.length) {
          previousNodes.forEach((previousNode) => {
            if (previousNode.lightness <= 10) return;
            previousNode.lightness -= 5;

            const { row, col } = previousNode;
            if (row === 3 && col === 3) {
              board.array[row][col].style.backgroundColor = 'blue';
            } else {
              if (previousNode.lightness <= 30) board.array[row][col].style.color = 'white';
              board.array[row][col].style.backgroundColor = `hsla(0, 100%, ${previousNode.lightness}%)`;
            }
          });

          previousNeighbors.forEach((previousNeighbor) => {
            const { row, col } = previousNeighbor;
            if (row === 4 && col === 3) board.array[row][col].style.backgroundColor = 'green';
            else board.array[row][col].style.backgroundColor = '';
          });
          previousNeighbors = [];
        }

        if (row !== 3 && col !== 3) board.array[row][col].style.backgroundColor = 'hsla(0, 100%, 60%)';
        traversal.node.lightness = 60;
        previousNodes.push(traversal.node);
      } else {
        console.log(`Add node [${col}, ${row}] to queue`);

        board.array[row][col].style.backgroundColor = 'yellow';
        previousNeighbors.push(traversal.node);
      }

      current++;
      if (current >= traversals.length) {
        document.body.insertAdjacentHTML('beforeend', '<p>Now traversing...</p>');
        clearInterval(interval);
        resolve();
      }
    }, 30);
  }).then(async () => {
    await new Promise((resolve) => { setTimeout(resolve, 500); });

    return new Promise((resolve) => {
      const { row, col } = paths[0];
      document.body.insertAdjacentHTML('beforeend', `<p>Start at <span style="color: limegreen;">[${col}, ${row}]</span></p>`);

      let current = 0;
      let previousNode;
      const interval = setInterval(() => {
        const path = paths[current];
        const { row, col } = path;

        board.array[row][col].style.color = '';
        board.array[row][col].style.backgroundColor = 'lime';

        if (previousNode) {
          const prevRow = previousNode.row;
          const prevCol = previousNode.col;
          document.body.insertAdjacentHTML('beforeend', `<p>From <span style="color: limegreen;">[${prevCol}, ${prevRow}]</span> to <span style="color: limegreen;">[${col}, ${row}]</span></p>`);
        }

        previousNode = path;
        current++;
        if (current >= paths.length) {
          clearInterval(interval);
          resolve();
        }
      }, 800);
    });
  }).then(() => {
    document.body.insertAdjacentHTML('beforeend', '<p>Done!</p>');
  });
}
