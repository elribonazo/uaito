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

Defined in: [domain/types.ts:490](https://github.com/elribonazo/uaito/blob/05c34820022d2c3b044fab18390fca3eb7cd7f91/packages/sdk/src/domain/types.ts#L490)

Represents a block containing the model's thinking or reasoning process.
 ThinkingBlock

## Properties

### signature

```ts
signature: string;
```

Defined in: [domain/types.ts:495](https://github.com/elribonazo/uaito/blob/05c34820022d2c3b044fab18390fca3eb7cd7f91/packages/sdk/src/domain/types.ts#L495)

The signature of the thinking block.

***

### thinking

```ts
thinking: string;
```

Defined in: [domain/types.ts:501](https://github.com/elribonazo/uaito/blob/05c34820022d2c3b044fab18390fca3eb7cd7f91/packages/sdk/src/domain/types.ts#L501)

The thinking content.

***

### type

```ts
type: "thinking";
```

Defined in: [domain/types.ts:507](https://github.com/elribonazo/uaito/blob/05c34820022d2c3b044fab18390fca3eb7cd7f91/packages/sdk/src/domain/types.ts#L507)

The type of the block, indicating thinking.
