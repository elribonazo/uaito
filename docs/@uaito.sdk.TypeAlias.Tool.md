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
        items?: unknown;
        type: string;
     }>;
     required?: string[];
     type: "object";
  };
  isCollapsed?: boolean;
  name: string;
};
```

Defined in: [domain/types.ts:44](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L44)

Describes a tool that an LLM can use. This structure is used to define the tool's
name, purpose, and the schema for its inputs.

## Properties

### code?

```ts
optional code: string;
```

Defined in: [domain/types.ts:79](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L79)

The implementation code for the tool (optional).

***

### description

```ts
description: string;
```

Defined in: [domain/types.ts:59](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L59)

The description of the tool.

***

### enabled?

```ts
optional enabled: boolean;
```

Defined in: [domain/types.ts:84](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L84)

Whether the tool is currently enabled and can be used by the LLM.

***

### id?

```ts
optional id: number;
```

Defined in: [domain/types.ts:49](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L49)

The unique ID of the tool.

***

### input\_schema

```ts
input_schema: {
  properties: Record<string, {
     default?: unknown;
     description: string;
     items?: unknown;
     type: string;
  }>;
  required?: string[];
  type: "object";
};
```

Defined in: [domain/types.ts:65](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L65)

A JSON schema defining the inputs for the tool.
The `properties` object describes each parameter the tool accepts.

#### properties

```ts
properties: Record<string, {
  default?: unknown;
  description: string;
  items?: unknown;
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

Defined in: [domain/types.ts:89](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L89)

UI hint for whether the tool's definition should be collapsed by default.

***

### name

```ts
name: string;
```

Defined in: [domain/types.ts:54](https://github.com/elribonazo/uaito/blob/10c858615d5976b68ccf5217d266c8a90a84a5d9/packages/sdk/src/domain/types.ts#L54)

The name of the tool, which the LLM will use to call it.
