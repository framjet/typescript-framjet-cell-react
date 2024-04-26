import * as React from 'react';
import { CellStore, getDefaultStore } from '@framjet/cell';

interface CellStoreContextProps {
  cellStore: CellStore;
}

export const CellStoreContext = React.createContext<
  CellStoreContextProps | undefined
>(undefined);

interface ProvidedCellStoreProviderProps {
  store: CellStore;
  children?: React.ReactNode;
}

interface DefaultCellStoreProviderProps {
  name?: string;
  children?: React.ReactNode;
}

type CellStoreProviderProps = ProvidedCellStoreProviderProps | DefaultCellStoreProviderProps;

type Options = {
  store?: CellStore;
}

export function useCellStore(options?: Options): CellStore {
  const cellStore = React.useContext(CellStoreContext);

  return options?.store || cellStore?.cellStore || getDefaultStore();
}

export function CellStoreProvider(props: CellStoreProviderProps) {
  const cellStoreRef = React.useRef<CellStore>();
  const { store, name, children } = props as ProvidedCellStoreProviderProps & DefaultCellStoreProviderProps;

  if (store === undefined && cellStoreRef.current === undefined) {
    cellStoreRef.current = new CellStore(name);
  }

  const cellStore = store || cellStoreRef.current;
  if (!cellStore) {
    throw new Error('No CellStore provided');
  }

  return React.createElement(
    CellStoreContext.Provider,
    {
      value: {
        cellStore
      }
    },
    children
  );
}
