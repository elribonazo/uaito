[**Documentation**](../../../README.md)

***

[Documentation](../../../README.md) / [@uaito/sdk](../README.md) / DeltaBlock

# Type Alias: DeltaBlock

> **DeltaBlock** = `object`

Defined in: [domain/types.ts:223](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/sdk/src/domain/types.ts#L223)

Represents a delta block.

## Properties

### stop\_reason

> **stop\_reason**: `"end_turn"` \| `"max_tokens"` \| `"stop_sequence"` \| `"tool_use"` \| `null`

Defined in: [domain/types.ts:233](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/sdk/src/domain/types.ts#L233)

The reason the stream stopped.

***

### stop\_sequence

> **stop\_sequence**: `string` \| `null`

Defined in: [domain/types.ts:239](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/sdk/src/domain/types.ts#L239)

The stop sequence.

***

### type

> **type**: `"delta"`

Defined in: [domain/types.ts:228](https://github.com/elribonazo/uaito/blob/329283f19d75a4623970a839744308f19ace5c16/packages/sdk/src/domain/types.ts#L228)

The type of the block.
