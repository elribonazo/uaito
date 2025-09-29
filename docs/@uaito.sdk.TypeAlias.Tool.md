<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / [@uaito/sdk](@uaito.sdk.md) / Tool

# Type Alias: Tool

```ts
type Tool = {
  code?: string;
  description: string;
  enabled?: boolean;
  id?: number;
  input_schema: {
     properties: Record<string, {
        default?: unknown;
        description: string;
        type: string;
     }>;
     required?: string[];
     type: "object";
  };
  isCollapsed?: boolean;
  name: string;
};
```

Defined in: [domain/types.ts:42](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L42)

Represents a tool that can be used by an LLM.

## Properties

### code?

```ts
optional code: string;
```

Defined in: [domain/types.ts:75](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L75)

The code for the tool.

***

### description

```ts
description: string;
```

Defined in: [domain/types.ts:57](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L57)

The description of the tool.

***

### enabled?

```ts
optional enabled: boolean;
```

Defined in: [domain/types.ts:80](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L80)

Whether the tool is enabled.

***

### id?

```ts
optional id: number;
```

Defined in: [domain/types.ts:47](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L47)

The unique ID of the tool.

***

### input\_schema

```ts
input_schema: {
  properties: Record<string, {
     default?: unknown;
     description: string;
     type: string;
  }>;
  required?: string[];
  type: "object";
};
```

Defined in: [domain/types.ts:62](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L62)

The input schema for the tool.

#### properties

```ts
properties: Record<string, {
  default?: unknown;
  description: string;
  type: string;
}>;
```

#### required?

```ts
optional required: string[];
```

#### type

```ts
type: "object";
```

***

### isCollapsed?

```ts
optional isCollapsed: boolean;
```

Defined in: [domain/types.ts:85](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L85)

Whether the tool is collapsed.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:52](https://github.com/elribonazo/uaito/blob/72573bbc3726a270f775ca1678ea7e537c70665d/packages/sdk/src/domain/types.ts#L52)

The name of the tool.
