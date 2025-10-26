<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / BaseMessage

# Abstract Class: BaseMessage

Defined in: [domain/types.ts:290](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L290)

An abstract base class for creating message structures.

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

Defined in: [domain/types.ts:308](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L308)

The buffer for the message.

***

### replacements

```ts
abstract replacements: string[];
```

Defined in: [domain/types.ts:302](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L302)

An array of strings to be replaced in the message content.

***

### tools

```ts
protected tools: Tool[];
```

Defined in: [domain/types.ts:315](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L315)

An array of available tools.

## Methods

### cleanChunk()

```ts
protected cleanChunk(chunk): string;
```

Defined in: [domain/types.ts:322](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L322)

Cleans a chunk of text by removing placeholder replacements.

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

Defined in: [domain/types.ts:296](https://github.com/elribonazo/uaito/blob/04309312147c13e296b527f56b609459b13e7903/packages/sdk/src/domain/types.ts#L296)

Renders the message.

#### Returns

`Promise`\<[`Message`](@uaito.sdk.TypeAlias.Message.md)\>

A promise that resolves to the rendered message.
