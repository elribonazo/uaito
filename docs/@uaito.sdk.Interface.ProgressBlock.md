<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / ProgressBlock

# Interface: ProgressBlock

Defined in: [domain/types.ts:472](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L472)

Represents a block for reporting progress.
 ProgressBlock

## Properties

### message?

```ts
optional message: string;
```

Defined in: [domain/types.ts:489](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L489)

An optional message about the progress.

***

### progress

```ts
progress: number;
```

Defined in: [domain/types.ts:483](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L483)

The progress percentage (0-100).

***

### type

```ts
type: "progress";
```

Defined in: [domain/types.ts:477](https://github.com/elribonazo/uaito/blob/61fe38d8ca6389b9df4b175df981376a787b30b1/packages/sdk/src/domain/types.ts#L477)

The type of the block.
