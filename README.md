# FramJet Cell React Utils

A set of React hooks and utilities for seamless integration of `@framjet/cell` state management library in React
applications, providing a simple and efficient way to manage state using cells in React components.

## Installation

You can install `@framjet/cell-react` using your preferred package manager:

npm:

```bash
npm install @framjet/cell-react
```

Yarn:

```bash
yarn add @framjet/cell-react
```

pnpm:

```bash
pnpm add @framjet/cell-react
```

## Usage

### CellStoreProvider

To use `@framjet/cell-react` in your React application, you need to wrap your components with the `CellStoreProvider`.
This provider component makes the `CellStore` available to all the child components.

```jsx
import { CellStoreProvider } from '@framjet/cell-react';

function App() {
  return (
    <CellStoreProvider>
      {/* Your application components */}
    </CellStoreProvider>
  );
}
```

### useCellValue

The `useCellValue` hook allows you to read the value of a cell in a React component.

```jsx
import { cell } from '@framjet/cell';
import { useCellValue } from '@framjet/cell-react';

const countCell = cell(0);

function CountDisplay() {
  const count = useCellValue(countCell);

  return <div>Count: {count}</div>;
}
```

### useSetCell

The `useSetCell` hook provides a way to update the value of a writable cell in a React component.

```jsx
import { cell } from '@framjet/cell';
import { useSetCell } from '@framjet/cell-react';

const countCell = cell(0);

function IncrementButton() {
  const setCount = useSetCell(countCell);

  return <button onClick={() => setCount(count => count + 1)}>Increment</button>;
}
```

### useCell

The `useCell` hook combines the functionality of `useCellValue` and `useSetCell`, allowing you to read and update the
value of a cell in a React component.

```jsx
import { cell } from '@framjet/cell';
import { useCell } from '@framjet/cell-react';

const countCell = cell(0);

function Counter() {
  const [count, setCount] = useCell(countCell);

  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={() => setCount(count => count + 1)}>Increment</button>
    </div>
  );
}
```


## Contributing

Contributions to `@framjet/cell-react` are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue on the project's repository.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

