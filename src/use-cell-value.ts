/// <reference types="react/experimental" />
import * as React from 'react';
import type { Cell, CellStore, ExtractCellValue } from '@framjet/cell';
import { useCellStore } from './cell-store-provider';

const isPromiseLike = (x: unknown): x is PromiseLike<unknown> =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeof (x as any)?.then === 'function'

const use =
  React.use ||
  (<T>(
    promise: PromiseLike<T> & {
      status?: 'pending' | 'fulfilled' | 'rejected'
      value?: T
      reason?: unknown
    },
  ): T => {
    if (promise.status === 'pending') {
      throw promise
    } else if (promise.status === 'fulfilled') {
      return promise.value as T
    } else if (promise.status === 'rejected') {
      throw promise.reason
    } else {
      promise.status = 'pending'
      promise.then(
        (v) => {
          promise.status = 'fulfilled'
          promise.value = v
        },
        (e) => {
          promise.status = 'rejected'
          promise.reason = e
        },
      )
      throw promise
    }
  })

type Options = Parameters<typeof useCellStore>[0] & {
  delay?: number
}

export function useCellValue<Value>(
  cell: Cell<Value>,
  options?: Options
): Awaited<Value>

export function useCellValue<T extends Cell<unknown>>(
  cell: T,
  options?: Options
): Awaited<ExtractCellValue<T>>

export function useCellValue<Value>(cell: Cell<Value>, options?: Options) {
  const cellStore = useCellStore(options);

  const [[valueFromReducer, storeFromReducer, cellFromReducer], rerender] =
    React.useReducer<
      React.ReducerWithoutAction<readonly [Value, CellStore, typeof cell]>,
      undefined
    >(
      (prev) => {
        const nextValue = cellStore.readCell(cell);

        if (
          Object.is(prev[0], nextValue) &&
          prev[1] === cellStore &&
          prev[2] === cell
        ) {
          return prev;
        }

        return [nextValue, cellStore, cell];
      },
      undefined,
      () => [cellStore.readCell(cell), cellStore, cell]
    );

  let value = valueFromReducer;
  if (storeFromReducer !== cellStore || cellFromReducer !== cell) {
    rerender();
    value = cellStore.readCell(cell);
  }

  const delay = options?.delay;
  React.useEffect(() => {
    const unsub = cellStore.subscribeCell(cell, () => {
      if (typeof delay === 'number') {
        // delay re-rendering to wait a promise possibly to resolve
        setTimeout(rerender, delay);
        return;
      }
      rerender();
    });
    rerender();
    return unsub;
  }, [cellStore, cell, delay]);

  React.useDebugValue(value);

  // TS doesn't allow using `use` always.
  // The use of isPromiseLike is to be consistent with `use` type.
  // `instanceof Promise` actually works fine in this case.
  return isPromiseLike(value) ? use(value) : (value as Awaited<Value>);
}
