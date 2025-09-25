<div style="display:flex; flex-direction:column; align-items:center;">
<p align="center">
  <img src="../UAITO.png" alt="UAITO Logo" width="200"/>
</p>

<p align="center">
  <strong>A unified TypeScript SDK for seamless interaction with various Large Language Models.</strong>
</p>
</div>

[Documentation](README.md) / @uaito/sdk

# @uaito/sdk

## Enumerations

| Enumeration | Description |
| ------ | ------ |
| [LLMProvider](@uaito.sdk.Enumeration.LLMProvider.md) | Enumeration of the available LLM providers. |

## Classes

| Class | Description |
| ------ | ------ |
| [BaseAgent](@uaito.sdk.Class.BaseAgent.md) | An abstract class for a base agent. |
| [BaseLLM](@uaito.sdk.Class.BaseLLM.md) | Abstract base class for Language Model implementations. |
| [BaseMessage](@uaito.sdk.Class.BaseMessage.md) | An abstract class for a base message. |
| [MessageArray](@uaito.sdk.Class.MessageArray.md) | A specialized array class for managing messages, with validation and merging capabilities. MessageArray |
| [Runner](@uaito.sdk.Class.Runner.md) | An abstract class for a runner that performs a task stream. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [RedactedThinkingBlock](@uaito.sdk.Interface.RedactedThinkingBlock.md) | Represents a redacted thinking block. RedactedThinkingBlock |
| [SearchReplaceBlock](@uaito.sdk.Interface.SearchReplaceBlock.md) | Represents a search and replace block. SearchReplaceBlock |
| [ServerToolUseBlock](@uaito.sdk.Interface.ServerToolUseBlock.md) | Represents a server tool use block. ServerToolUseBlock |
| [SignatureDeltaBlock](@uaito.sdk.Interface.SignatureDeltaBlock.md) | Represents a signature delta block. SignatureDeltaBlock |
| [ThinkingBlock](@uaito.sdk.Interface.ThinkingBlock.md) | Represents a thinking block. ThinkingBlock |
| [WebSearchResultBlock](@uaito.sdk.Interface.WebSearchResultBlock.md) | Represents a web search result block. WebSearchResultBlock |
| [WebSearchToolResultBlock](@uaito.sdk.Interface.WebSearchToolResultBlock.md) | Represents a web search tool result block. WebSearchToolResultBlock |
| [WebSearchToolResultError](@uaito.sdk.Interface.WebSearchToolResultError.md) | Represents a web search tool result error. WebSearchToolResultError |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ArrayElementType](@uaito.sdk.TypeAlias.ArrayElementType.md) | Gets the element type of an array. |
| [AudioBlock](@uaito.sdk.TypeAlias.AudioBlock.md) | Represents an audio block. |
| [BaseLLMCache](@uaito.sdk.TypeAlias.BaseLLMCache.md) | Represents the cache for a base LLM. |
| [BaseLLMOptions](@uaito.sdk.TypeAlias.BaseLLMOptions.md) | Represents the options for a base LLM. |
| [BlockType](@uaito.sdk.TypeAlias.BlockType.md) | Represents the type of a block. |
| [DeltaBlock](@uaito.sdk.TypeAlias.DeltaBlock.md) | Represents a delta block. |
| [ErrorBlock](@uaito.sdk.TypeAlias.ErrorBlock.md) | Represents an error block. |
| [ImageBlock](@uaito.sdk.TypeAlias.ImageBlock.md) | Represents an image block. |
| [Message](@uaito.sdk.TypeAlias.Message.md) | Represents a message. |
| [MessageContent](@uaito.sdk.TypeAlias.MessageContent.md) | Represents the content of a message. |
| [MessageInput](@uaito.sdk.TypeAlias.MessageInput.md) | Represents a message input. |
| [MessageType](@uaito.sdk.TypeAlias.MessageType.md) | Represents the type of a message. |
| [OnTool](@uaito.sdk.TypeAlias.OnTool.md) | Represents a callback for tool usage. |
| [ReadableStreamWithAsyncIterable](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md) | Represents a readable stream with an async iterable. |
| [Role](@uaito.sdk.TypeAlias.Role.md) | Represents the role of a message. |
| [TextBlock](@uaito.sdk.TypeAlias.TextBlock.md) | Represents a text block. |
| [Tool](@uaito.sdk.TypeAlias.Tool.md) | Represents a tool that can be used by an LLM. |
| [ToolBlock](@uaito.sdk.TypeAlias.ToolBlock.md) | Represents a block of a tool. |
| [ToolInputDelta](@uaito.sdk.TypeAlias.ToolInputDelta.md) | Represents a tool input delta. |
| [ToolResultBlock](@uaito.sdk.TypeAlias.ToolResultBlock.md) | Represents a tool result block. |
| [ToolUseBlock](@uaito.sdk.TypeAlias.ToolUseBlock.md) | Represents a tool use block. |
| [TransformStreamFn](@uaito.sdk.TypeAlias.TransformStreamFn.md) | Represents a function that transforms a chunk of data in a stream. |
| [USAGE](@uaito.sdk.TypeAlias.USAGE.md) | Represents the usage of tokens. |
| [UsageBlock](@uaito.sdk.TypeAlias.UsageBlock.md) | Represents a usage block. |
| [WebSearchToolResultBlockContent](@uaito.sdk.TypeAlias.WebSearchToolResultBlockContent.md) | Represents the content of a web search tool result block. |

## Functions

| Function | Description |
| ------ | ------ |
| [blobToDataURL](@uaito.sdk.Function.blobToDataURL.md) | Converts a Blob to a data URL. |
