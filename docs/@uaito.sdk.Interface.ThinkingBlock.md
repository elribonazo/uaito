<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ThinkingBlock

# Interface: ThinkingBlock

Defined in: [domain/types.ts:513](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L513)

Represents a block containing the model's thinking or reasoning process.
 ThinkingBlock

## Properties

### signature

```ts
signature: string;
```

Defined in: [domain/types.ts:518](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L518)

The signature of the thinking block.

***

### thinking

```ts
thinking: string;
```

Defined in: [domain/types.ts:524](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L524)

The thinking content.

***

### type

```ts
type: "thinking";
```

Defined in: [domain/types.ts:530](https://github.com/elribonazo/uaito/blob/5502a2c87fe1b258ed3eea107257b14d895c9793/packages/sdk/src/domain/types.ts#L530)

The type of the block, indicating thinking.
