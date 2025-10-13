<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / MessageArray

# Class: MessageArray\<T\>

Defined in: [utils.ts:94](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/utils.ts#L94)

A specialized array class for managing an array of `MessageInput` objects.
It extends the native `Array` but overrides the `push` method to automatically
validate and merge consecutive messages from the same user role.

 MessageArray

## Example

```typescript
const messages = new MessageArray();
messages.push({ role: 'user', content: [{ type: 'text', text: 'Hello' }] });
messages.push({ role: 'user', content: [{ type: 'text', text: ' world!' }] });
// messages will contain a single message with content "Hello world!"
```

## Extends

- `Array`\<`T`\>

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `T` *extends* [`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md) | The type of message, which must extend `MessageInput`. |

## Indexable

```ts
[n: number]: T
```

## Constructors

### Constructor

```ts
new MessageArray<T>(items?): MessageArray<T>;
```

Defined in: [utils.ts:111](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/utils.ts#L111)

Creates an instance of `MessageArray`.
It uses a `Proxy` to intercept the `push` method, enabling custom logic for
validating and merging messages before they are added to the array.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `items?` | `T`[] | `[]` | The initial items for the array. |

#### Returns

`MessageArray`\<`T`\>

#### Overrides

```ts
Array<T>.constructor
```

## Properties

### \[unscopables\]

```ts
readonly [unscopables]: {
[key: number]: undefined | boolean;
  [iterator]?: boolean;
  [unscopables]?: boolean;
  at?: boolean;
  concat?: boolean;
  copyWithin?: boolean;
  entries?: boolean;
  every?: boolean;
  fill?: boolean;
  filter?: boolean;
  find?: boolean;
  findIndex?: boolean;
  findLast?: boolean;
  findLastIndex?: boolean;
  flat?: boolean;
  flatMap?: boolean;
  forEach?: boolean;
  includes?: boolean;
  indexOf?: boolean;
  join?: boolean;
  keys?: boolean;
  lastIndexOf?: boolean;
  length?: boolean;
  map?: boolean;
  pop?: boolean;
  push?: boolean;
  reduce?: boolean;
  reduceRight?: boolean;
  reverse?: boolean;
  shift?: boolean;
  slice?: boolean;
  some?: boolean;
  sort?: boolean;
  splice?: boolean;
  toLocaleString?: boolean;
  toReversed?: boolean;
  toSorted?: boolean;
  toSpliced?: boolean;
  toString?: boolean;
  unshift?: boolean;
  values?: boolean;
  with?: boolean;
};
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:97

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### Index Signature

```ts
[key: number]: undefined | boolean
```

#### \[iterator\]?

```ts
optional [iterator]: boolean;
```

#### \[unscopables\]?

```ts
readonly optional [unscopables]: boolean;
```

Is an object whose properties have the value 'true'
when they will be absent when used in a 'with' statement.

#### at?

```ts
optional at: boolean;
```

#### concat?

```ts
optional concat: boolean;
```

#### copyWithin?

```ts
optional copyWithin: boolean;
```

#### entries?

```ts
optional entries: boolean;
```

#### every?

```ts
optional every: boolean;
```

#### fill?

```ts
optional fill: boolean;
```

#### filter?

```ts
optional filter: boolean;
```

#### find?

```ts
optional find: boolean;
```

#### findIndex?

```ts
optional findIndex: boolean;
```

#### findLast?

```ts
optional findLast: boolean;
```

#### findLastIndex?

```ts
optional findLastIndex: boolean;
```

#### flat?

```ts
optional flat: boolean;
```

#### flatMap?

```ts
optional flatMap: boolean;
```

#### forEach?

```ts
optional forEach: boolean;
```

#### includes?

```ts
optional includes: boolean;
```

#### indexOf?

```ts
optional indexOf: boolean;
```

#### join?

```ts
optional join: boolean;
```

#### keys?

```ts
optional keys: boolean;
```

#### lastIndexOf?

```ts
optional lastIndexOf: boolean;
```

#### length?

```ts
optional length: boolean;
```

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### map?

```ts
optional map: boolean;
```

#### pop?

```ts
optional pop: boolean;
```

#### push?

```ts
optional push: boolean;
```

#### reduce?

```ts
optional reduce: boolean;
```

#### reduceRight?

```ts
optional reduceRight: boolean;
```

#### reverse?

```ts
optional reverse: boolean;
```

#### shift?

```ts
optional shift: boolean;
```

#### slice?

```ts
optional slice: boolean;
```

#### some?

```ts
optional some: boolean;
```

#### sort?

```ts
optional sort: boolean;
```

#### splice?

```ts
optional splice: boolean;
```

#### toLocaleString?

```ts
optional toLocaleString: boolean;
```

#### toReversed?

```ts
optional toReversed: boolean;
```

#### toSorted?

```ts
optional toSorted: boolean;
```

#### toSpliced?

```ts
optional toSpliced: boolean;
```

#### toString?

```ts
optional toString: boolean;
```

#### unshift?

```ts
optional unshift: boolean;
```

#### values?

```ts
optional values: boolean;
```

#### with?

```ts
optional with: boolean;
```

#### Inherited from

```ts
Array.[unscopables]
```

***

### length

```ts
length: number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1329

Gets or sets the length of the array. This is a number one higher than the highest index in the array.

#### Inherited from

```ts
Array.length
```

***

### \[species\]

```ts
readonly static [species]: ArrayConstructor;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:316

#### Inherited from

```ts
Array.[species]
```

## Methods

### \[iterator\]()

```ts
iterator: ArrayIterator<T>;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.iterable.d.ts:78

Iterator

#### Returns

`ArrayIterator`\<`T`\>

#### Inherited from

```ts
Array.[iterator]
```

***

### at()

```ts
at(index): undefined | T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2022.array.d.ts:24

Returns the item located at the specified index.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | The zero-based index of the desired code unit. A negative index will count back from the last item. |

#### Returns

`undefined` \| `T`

#### Inherited from

```ts
Array.at
```

***

### concat()

#### Call Signature

```ts
concat(...items): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1353

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`items` | `ConcatArray`\<`T`\>[] | Additional arrays and/or items to add to the end of the array. |

##### Returns

`T`[]

##### Inherited from

```ts
Array.concat
```

#### Call Signature

```ts
concat(...items): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1359

Combines two or more arrays.
This method returns a new array without modifying any existing arrays.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`items` | (`T` \| `ConcatArray`\<`T`\>)[] | Additional arrays and/or items to add to the end of the array. |

##### Returns

`T`[]

##### Inherited from

```ts
Array.concat
```

***

### copyWithin()

```ts
copyWithin(
   target, 
   start, 
   end?): this;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:62

Returns the this object after copying a section of the array identified by start and end
to the same array starting at position target

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `number` | If target is negative, it is treated as length+target where length is the length of the array. |
| `start` | `number` | If start is negative, it is treated as length+start. If end is negative, it is treated as length+end. |
| `end?` | `number` | If not specified, length of the this object is used as its default value. |

#### Returns

`this`

#### Inherited from

```ts
Array.copyWithin
```

***

### entries()

```ts
entries(): ArrayIterator<[number, T]>;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.iterable.d.ts:83

Returns an iterable of key, value pairs for every entry in the array

#### Returns

`ArrayIterator`\<\[`number`, `T`\]\>

#### Inherited from

```ts
Array.entries
```

***

### every()

#### Call Signature

```ts
every<S>(predicate, thisArg?): this is S[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1440

Determines whether all the members of an array satisfy the specified test.

##### Type Parameters

| Type Parameter |
| ------ |
| `S` *extends* [`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `value is S` | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

##### Returns

`this is S[]`

##### Inherited from

```ts
Array.every
```

#### Call Signature

```ts
every(predicate, thisArg?): boolean;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1449

Determines whether all the members of an array satisfy the specified test.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `unknown` | A function that accepts up to three arguments. The every method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value false, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

##### Returns

`boolean`

##### Inherited from

```ts
Array.every
```

***

### fill()

```ts
fill(
   value, 
   start?, 
   end?): this;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:51

Changes all array elements from `start` to `end` index to a static `value` and returns the modified array

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `T` | value to fill array section with |
| `start?` | `number` | index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array. |
| `end?` | `number` | index to stop filling the array at. If end is negative, it is treated as length+end. |

#### Returns

`this`

#### Inherited from

```ts
Array.fill
```

***

### filter()

#### Call Signature

```ts
filter<S>(predicate, thisArg?): S[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1476

Returns the elements of an array that meet the condition specified in a callback function.

##### Type Parameters

| Type Parameter |
| ------ |
| `S` *extends* [`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `value is S` | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

##### Returns

`S`[]

##### Inherited from

```ts
Array.filter
```

#### Call Signature

```ts
filter(predicate, thisArg?): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1482

Returns the elements of an array that meet the condition specified in a callback function.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `unknown` | A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

##### Returns

`T`[]

##### Inherited from

```ts
Array.filter
```

***

### find()

#### Call Signature

```ts
find<S>(predicate, thisArg?): undefined | S;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:29

Returns the value of the first element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

| Type Parameter |
| ------ |
| `S` *extends* [`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `obj`) => `value is S` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, find immediately returns that element value. Otherwise, find returns undefined. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

##### Returns

`undefined` \| `S`

##### Inherited from

```ts
Array.find
```

#### Call Signature

```ts
find(predicate, thisArg?): undefined | T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:30

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`value`, `index`, `obj`) => `unknown` |
| `thisArg?` | `any` |

##### Returns

`undefined` \| `T`

##### Inherited from

```ts
Array.find
```

***

### findIndex()

```ts
findIndex(predicate, thisArg?): number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:41

Returns the index of the first element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `obj`) => `unknown` | find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`number`

#### Inherited from

```ts
Array.findIndex
```

***

### findLast()

#### Call Signature

```ts
findLast<S>(predicate, thisArg?): undefined | S;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:29

Returns the value of the last element in the array where predicate is true, and undefined
otherwise.

##### Type Parameters

| Type Parameter |
| ------ |
| `S` *extends* [`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md) |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `value is S` | findLast calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLast immediately returns that element value. Otherwise, findLast returns undefined. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

##### Returns

`undefined` \| `S`

##### Inherited from

```ts
Array.findLast
```

#### Call Signature

```ts
findLast(predicate, thisArg?): undefined | T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:30

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `unknown` |
| `thisArg?` | `any` |

##### Returns

`undefined` \| `T`

##### Inherited from

```ts
Array.findLast
```

***

### findLastIndex()

```ts
findLastIndex(predicate, thisArg?): number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:41

Returns the index of the last element in the array where predicate is true, and -1
otherwise.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `unknown` | findLastIndex calls predicate once for each element of the array, in descending order, until it finds one where predicate returns true. If such an element is found, findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1. |
| `thisArg?` | `any` | If provided, it will be used as the this value for each invocation of predicate. If it is not provided, undefined is used instead. |

#### Returns

`number`

#### Inherited from

```ts
Array.findLastIndex
```

***

### flat()

```ts
flat<A, D>(this, depth?): FlatArray<A, D>[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2019.array.d.ts:75

Returns a new array with all sub-array elements concatenated into it recursively up to the
specified depth.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` | - |
| `D` *extends* `number` | `1` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `this` | `A` | - |
| `depth?` | `D` | The maximum recursion depth |

#### Returns

`FlatArray`\<`A`, `D`\>[]

#### Inherited from

```ts
Array.flat
```

***

### flatMap()

```ts
flatMap<U, This>(callback, thisArg?): U[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2019.array.d.ts:64

Calls a defined callback function on each element of an array. Then, flattens the result into
a new array.
This is identical to a map followed by flat with depth 1.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `U` | - |
| `This` | `undefined` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`this`, `value`, `index`, `array`) => `U` \| readonly `U`[] | A function that accepts up to three arguments. The flatMap method calls the callback function one time for each element in the array. |
| `thisArg?` | `This` | An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

#### Inherited from

```ts
Array.flatMap
```

***

### forEach()

```ts
forEach(callbackfn, thisArg?): void;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1464

Performs the specified action for each element in an array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbackfn` | (`value`, `index`, `array`) => `void` | A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`void`

#### Inherited from

```ts
Array.forEach
```

***

### includes()

```ts
includes(searchElement, fromIndex?): boolean;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2016.array.include.d.ts:25

Determines whether an array includes a certain element, returning true or false as appropriate.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `searchElement` | `T` | The element to search for. |
| `fromIndex?` | `number` | The position in this array at which to begin searching for searchElement. |

#### Returns

`boolean`

#### Inherited from

```ts
Array.includes
```

***

### indexOf()

```ts
indexOf(searchElement, fromIndex?): number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1425

Returns the index of the first occurrence of a value in an array, or -1 if it is not present.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `searchElement` | `T` | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0. |

#### Returns

`number`

#### Inherited from

```ts
Array.indexOf
```

***

### isSameRole()

```ts
protected isSameRole(lastOne, item): boolean;
```

Defined in: [utils.ts:170](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/utils.ts#L170)

Determines whether a new message should be merged with the previous one.
Merging occurs if both messages are from the 'user' and the new message does not contain a tool result.
This is useful for combining consecutive user text inputs into a single message.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lastOne` | `T` | The last message in the array. |
| `item` | `T` | The new message to be added. |

#### Returns

`boolean`

`true` if the messages should be merged, otherwise `false`.

***

### join()

```ts
join(separator?): string;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1364

Adds all the elements of an array into a string, separated by the specified separator string.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `separator?` | `string` | A string used to separate one element of the array from the next in the resulting string. If omitted, the array elements are separated with a comma. |

#### Returns

`string`

#### Inherited from

```ts
Array.join
```

***

### keys()

```ts
keys(): ArrayIterator<number>;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.iterable.d.ts:88

Returns an iterable of keys in the array

#### Returns

`ArrayIterator`\<`number`\>

#### Inherited from

```ts
Array.keys
```

***

### lastIndexOf()

```ts
lastIndexOf(searchElement, fromIndex?): number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1431

Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `searchElement` | `T` | The value to locate in the array. |
| `fromIndex?` | `number` | The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array. |

#### Returns

`number`

#### Inherited from

```ts
Array.lastIndexOf
```

***

### map()

```ts
map<U>(callbackfn, thisArg?): U[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1470

Calls a defined callback function on each element of an array, and returns an array that contains the results.

#### Type Parameters

| Type Parameter |
| ------ |
| `U` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbackfn` | (`value`, `index`, `array`) => `U` | A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`U`[]

#### Inherited from

```ts
Array.map
```

***

### pop()

```ts
pop(): undefined | T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1342

Removes the last element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| `T`

#### Inherited from

```ts
Array.pop
```

***

### push()

```ts
push(...items): number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1347

Appends new elements to the end of an array, and returns the new length of the array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`items` | `T`[] | New elements to add to the array. |

#### Returns

`number`

#### Inherited from

```ts
Array.push
```

***

### reduce()

#### Call Signature

```ts
reduce(callbackfn): T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1488

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `T` | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |

##### Returns

`T`

##### Inherited from

```ts
Array.reduce
```

#### Call Signature

```ts
reduce(callbackfn, initialValue): T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1489

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `T` |
| `initialValue` | `T` |

##### Returns

`T`

##### Inherited from

```ts
Array.reduce
```

#### Call Signature

```ts
reduce<U>(callbackfn, initialValue): U;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1495

Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

| Type Parameter |
| ------ |
| `U` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `U` | A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

##### Returns

`U`

##### Inherited from

```ts
Array.reduce
```

***

### reduceRight()

#### Call Signature

```ts
reduceRight(callbackfn): T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1501

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `T` | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |

##### Returns

`T`

##### Inherited from

```ts
Array.reduceRight
```

#### Call Signature

```ts
reduceRight(callbackfn, initialValue): T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1502

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `T` |
| `initialValue` | `T` |

##### Returns

`T`

##### Inherited from

```ts
Array.reduceRight
```

#### Call Signature

```ts
reduceRight<U>(callbackfn, initialValue): U;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1508

Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.

##### Type Parameters

| Type Parameter |
| ------ |
| `U` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callbackfn` | (`previousValue`, `currentValue`, `currentIndex`, `array`) => `U` | A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array. |
| `initialValue` | `U` | If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value. |

##### Returns

`U`

##### Inherited from

```ts
Array.reduceRight
```

***

### reverse()

```ts
reverse(): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1369

Reverses the elements in an array in place.
This method mutates the array and returns a reference to the same array.

#### Returns

`T`[]

#### Inherited from

```ts
Array.reverse
```

***

### shift()

```ts
shift(): undefined | T;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1374

Removes the first element from an array and returns it.
If the array is empty, undefined is returned and the array is not modified.

#### Returns

`undefined` \| `T`

#### Inherited from

```ts
Array.shift
```

***

### slice()

```ts
slice(start?, end?): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1384

Returns a copy of a section of an array.
For both start and end, a negative index can be used to indicate an offset from the end of the array.
For example, -2 refers to the second to last element of the array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start?` | `number` | The beginning index of the specified portion of the array. If start is undefined, then the slice begins at index 0. |
| `end?` | `number` | The end index of the specified portion of the array. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the array. |

#### Returns

`T`[]

#### Inherited from

```ts
Array.slice
```

***

### some()

```ts
some(predicate, thisArg?): boolean;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1458

Determines whether the specified callback function returns true for any element of an array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `predicate` | (`value`, `index`, `array`) => `unknown` | A function that accepts up to three arguments. The some method calls the predicate function for each element in the array until the predicate returns a value which is coercible to the Boolean value true, or until the end of the array. |
| `thisArg?` | `any` | An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value. |

#### Returns

`boolean`

#### Inherited from

```ts
Array.some
```

***

### sort()

```ts
sort(compareFn?): this;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1395

Sorts an array in place.
This method mutates the array and returns a reference to the same array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `compareFn?` | (`a`, `b`) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order. `[11,2,22,1].sort((a, b) => a - b)` |

#### Returns

`this`

#### Inherited from

```ts
Array.sort
```

***

### splice()

#### Call Signature

```ts
splice(start, deleteCount?): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1404

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove. Omitting this argument will remove all elements from the start paramater location to end of the array. If value of this argument is either a negative number, zero, undefined, or a type that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements. |

##### Returns

`T`[]

An array containing the elements that were deleted.

##### Inherited from

```ts
Array.splice
```

#### Call Signature

```ts
splice(
   start, 
   deleteCount, ...
   items): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1414

Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number` | The number of elements to remove. If value of this argument is either a negative number, zero, undefined, or a type that cannot be converted to an integer, the function will evaluate the argument as zero and not remove any elements. |
| ...`items` | `T`[] | Elements to insert into the array in place of the deleted elements. |

##### Returns

`T`[]

An array containing the elements that were deleted.

##### Inherited from

```ts
Array.splice
```

***

### toLocaleString()

#### Call Signature

```ts
toLocaleString(): string;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1337

Returns a string representation of an array. The elements are converted to string using their toLocaleString methods.

##### Returns

`string`

##### Inherited from

```ts
Array.toLocaleString
```

#### Call Signature

```ts
toLocaleString(locales, options?): string;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:64

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `locales` | `string` \| `string`[] |
| `options?` | `NumberFormatOptions` & `DateTimeFormatOptions` |

##### Returns

`string`

##### Inherited from

```ts
Array.toLocaleString
```

***

### toReversed()

```ts
toReversed(): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:46

Returns a copy of an array with its elements reversed.

#### Returns

`T`[]

#### Inherited from

```ts
Array.toReversed
```

***

### toSorted()

```ts
toSorted(compareFn?): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:57

Returns a copy of an array with its elements sorted.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `compareFn?` | (`a`, `b`) => `number` | Function used to determine the order of the elements. It is expected to return a negative value if the first argument is less than the second argument, zero if they're equal, and a positive value otherwise. If omitted, the elements are sorted in ascending, UTF-16 code unit order. `[11, 2, 22, 1].toSorted((a, b) => a - b) // [1, 2, 11, 22]` |

#### Returns

`T`[]

#### Inherited from

```ts
Array.toSorted
```

***

### toSpliced()

#### Call Signature

```ts
toSpliced(
   start, 
   deleteCount, ...
   items): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:66

Copies an array and removes elements and, if necessary, inserts new elements in their place. Returns the copied array.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount` | `number` | The number of elements to remove. |
| ...`items` | `T`[] | Elements to insert into the copied array in place of the deleted elements. |

##### Returns

`T`[]

The copied array.

##### Inherited from

```ts
Array.toSpliced
```

#### Call Signature

```ts
toSpliced(start, deleteCount?): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:74

Copies an array and removes elements while returning the remaining elements.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `start` | `number` | The zero-based location in the array from which to start removing elements. |
| `deleteCount?` | `number` | The number of elements to remove. |

##### Returns

`T`[]

A copy of the original array with the remaining elements.

##### Inherited from

```ts
Array.toSpliced
```

***

### toString()

```ts
toString(): string;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1333

Returns a string representation of an array.

#### Returns

`string`

#### Inherited from

```ts
Array.toString
```

***

### unshift()

```ts
unshift(...items): number;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1419

Inserts new elements at the start of an array, and returns the new length of the array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`items` | `T`[] | Elements to insert at the start of the array. |

#### Returns

`number`

#### Inherited from

```ts
Array.unshift
```

***

### values()

```ts
values(): ArrayIterator<T>;
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.iterable.d.ts:93

Returns an iterable of values in the array

#### Returns

`ArrayIterator`\<`T`\>

#### Inherited from

```ts
Array.values
```

***

### with()

```ts
with(index, value): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2023.array.d.ts:85

Copies an array, then overwrites the value at the provided index with the
given value. If the index is negative, then it replaces from the end
of the array.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | The index of the value to overwrite. If the index is negative, then it replaces from the end of the array. |
| `value` | `T` | The value to write into the copied array. |

#### Returns

`T`[]

The copied array with the updated value.

#### Inherited from

```ts
Array.with
```

***

### from()

```ts
static from(items): MessageArray<MessageInput>;
```

Defined in: [utils.ts:101](https://github.com/elribonazo/uaito/blob/762452db920dc79bc9eb750f005089537c56b014/packages/sdk/src/utils.ts#L101)

A static factory method to create a `MessageArray` from an array of `MessageInput` items.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `items` | [`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)[] | The items to create the `MessageArray` from. |

#### Returns

`MessageArray`\<[`MessageInput`](@uaito.sdk.TypeAlias.MessageInput.md)\>

A new `MessageArray` instance.

#### Overrides

```ts
Array.from
```

***

### fromAsync()

#### Call Signature

```ts
static fromAsync<T>(iterableOrArrayLike): Promise<T[]>;
```

Defined in: ../../../node\_modules/typescript/lib/lib.esnext.array.d.ts:24

Creates an array from an async iterator or iterable object.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iterableOrArrayLike` | \| `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T` \| `PromiseLike`\<`T`\>, `any`, `any`\> \| `ArrayLike`\<`T` \| `PromiseLike`\<`T`\>\> | An async iterator or array-like object to convert to an array. |

##### Returns

`Promise`\<`T`[]\>

##### Inherited from

```ts
Array.fromAsync
```

#### Call Signature

```ts
static fromAsync<T, U>(
   iterableOrArrayLike, 
   mapFn, 
thisArg?): Promise<Awaited<U>[]>;
```

Defined in: ../../../node\_modules/typescript/lib/lib.esnext.array.d.ts:34

Creates an array from an async iterator or iterable object.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |
| `U` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `iterableOrArrayLike` | \| `AsyncIterable`\<`T`, `any`, `any`\> \| `Iterable`\<`T`, `any`, `any`\> \| `ArrayLike`\<`T`\> | An async iterator or array-like object to convert to an array. |
| `mapFn` | (`value`, `index`) => `U` | - |
| `thisArg?` | `any` | Value of 'this' used when executing mapfn. |

##### Returns

`Promise`\<`Awaited`\<`U`\>[]\>

##### Inherited from

```ts
Array.fromAsync
```

***

### isArray()

```ts
static isArray(arg): arg is any[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es5.d.ts:1520

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `arg` | `any` |

#### Returns

`arg is any[]`

#### Inherited from

```ts
Array.isArray
```

***

### of()

```ts
static of<T>(...items): T[];
```

Defined in: ../../../node\_modules/typescript/lib/lib.es2015.core.d.ts:86

Returns a new array from a set of elements.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`items` | `T`[] | A set of elements to include in the new array object. |

#### Returns

`T`[]

#### Inherited from

```ts
Array.of
```
