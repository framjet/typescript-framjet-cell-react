import * as React from 'react';
import { Debug } from '@framjet/common';
import type { ExtractCellArgs, ExtractCellResult, SetCell, WritableCell } from '@framjet/cell';
import { useCellStore } from './cell-store-provider';

type Options = Parameters<typeof useCellStore>[0]

export function useSetCell<Value, Args extends unknown[], Result>(
  cell: WritableCell<Value, Args, Result>,
  options?: Options
): SetCell<Args, Result>

export function useSetCell<
  T extends WritableCell<unknown, never[], unknown>,
>(
  cell: T,
  options?: Options
): SetCell<ExtractCellArgs<T>, ExtractCellResult<T>>

export function useSetCell<Value, Args extends unknown[], Result>(
  cell: WritableCell<Value, Args, Result>,
  options?: Options
) {
  const cellStore = useCellStore(options);
  const setCell = React.useCallback(
    (...args: Args) => {
      if (Debug.isDevOrTest() && !('write' in cell)) {
        // useCell can pass non-writable cell with wrong type assertion,
        // so we should check here.

        throw new Error('not writable cell');
      }
      return cellStore.writeCell(cell, ...args);
    },
    [cellStore, cell]
  );

  return setCell;
}
