import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Given an array of values, calls the provided hashing function on each one and groups them by the returned
 * string, counting the values.
 * @param values A list of values to be counted
 * @param grouper A function which extracts a common key from a value
 * @returns A object with the extracted keys as keys and the count as value
 */
export function countBy<V>(values: V[], grouper: (value: V) => string): Record<string, number> {
  return values.reduce(
    (acc, v) => {
      const key = grouper(v)
      return {
        ...acc,
        [key]: (acc[key] ?? 0) + 1,
      }
    },
    {} as Record<string, number>
  )
}

/**
 * Takes an Array<T>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 */
export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
  const map = new Map<K, Array<V>>()

  list.forEach(item => {
    const key = keyGetter(item)
    const collection = map.get(key)
    if (!collection) {
      map.set(key, [item])
    } else {
      collection.push(item)
    }
  })

  return map
}
