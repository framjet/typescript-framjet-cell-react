import { useCellValue } from './use-cell-value';
import {
  type Cell,
  type ExtractCellArgs,
  type ExtractCellResult,
  type ExtractCellValue,
  PrimitiveCell,
  type SetCell,
  type WritableCell
} from '@framjet/cell';
import type { SetStateAction } from 'react';
import { useSetCell } from './use-set-cell';

type Options = Parameters<typeof useCellValue>[1]

export function useCell<Value, Args extends unknown[], Result>(
  cell: WritableCell<Value, Args, Result>,
  options?: Options
): [Awaited<Value>, SetCell<Args, Result>]

export function useCell<Value>(
  cell: PrimitiveCell<Value>,
  options?: Options
): [Awaited<Value>, SetCell<[SetStateAction<Value>], void>]

export function useCell<Value>(
  cell: Cell<Value>,
  options?: Options
): [Awaited<Value>, never]

export function useCell<
  T extends WritableCell<unknown, never[], unknown>,
>(
  cell: T,
  options?: Options
): [
  Awaited<ExtractCellValue<T>>,
  SetCell<ExtractCellArgs<T>, ExtractCellResult<T>>,
]

export function useCell<CellType extends Cell<unknown>>(
  cell: CellType,
  options?: Options
): [Awaited<ExtractCellValue<CellType>>, never]

export function useCell<Value, Args extends unknown[], Result>(
  cell: Cell<Value> | WritableCell<Value, Args, Result>,
  options?: Options
) {
  return [
    useCellValue(cell, options),
    // We do wrong type assertion here, which results in throwing an error.
    useSetCell(cell as WritableCell<Value, Args, Result>, options)
  ];
}
