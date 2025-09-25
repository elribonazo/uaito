<div style="display:flex; align-items:center;">
  <img alt="My logo" src="../UAITO.png" style="margin-right: .5em;" />
  <em>DOCS</em>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BaseMessage

# Abstract Class: BaseMessage

Defined in: [domain/types.ts:281](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L281)

An abstract class for a base message.

 BaseMessage

## Constructors

### Constructor

```ts
new BaseMessage(): BaseMessage;
```

#### Returns

`BaseMessage`

## Properties

### buffer

```ts
abstract buffer: string;
```

Defined in: [domain/types.ts:299](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L299)

The buffer for the message.

***

### replacements

```ts
abstract replacements: string[];
```

Defined in: [domain/types.ts:293](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L293)

An array of strings to be replaced in the message.

***

### tools

```ts
protected tools: Tool[];
```

Defined in: [domain/types.ts:306](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L306)

An array of available tools.

## Methods

### cleanChunk()

```ts
protected cleanChunk(chunk): string;
```

Defined in: [domain/types.ts:313](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L313)

Cleans a chunk of text by removing replacements.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `chunk` | `string` | The chunk to clean. |

#### Returns

`string`

The cleaned chunk.

***

### render()

```ts
abstract render(): Promise<Message>;
```

Defined in: [domain/types.ts:287](https://github.com/elribonazo/uaito/blob/fab0c6d8b23bcab892e93249daa38602f313cf4c/packages/sdk/src/domain/types.ts#L287)

Renders the message.

#### Returns

`Promise`\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>

A promise that resolves to the rendered message.
