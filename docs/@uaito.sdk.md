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
| [BaseAgent](@uaito.sdk.Class.BaseAgent.md) | An abstract class defining the core structure and functionality of an agent. Agents encapsulate an LLM and provide a higher-level interface for performing tasks. |
| [BaseLLM](@uaito.sdk.Class.BaseLLM.md) | Abstract base class for Language Model (LLM) implementations. It provides a standardized interface for interacting with various LLM providers, handling API retries, stream transformations, and tool usage. |
| [BaseMessage](@uaito.sdk.Class.BaseMessage.md) | An abstract base class for creating message structures. |
| [MessageArray](@uaito.sdk.Class.MessageArray.md) | A specialized array class for managing an array of `MessageInput` objects. It extends the native `Array` but overrides the `push` method to automatically validate and merge consecutive messages from the same user role. |
| [Runner](@uaito.sdk.Class.Runner.md) | An abstract class representing a task runner that executes an operation and returns a stream of messages. This is useful for long-running processes where results are produced incrementally. |

## Interfaces

| Interface | Description |
| ------ | ------ |
| [ProgressBlock](@uaito.sdk.Interface.ProgressBlock.md) | Represents a block for reporting progress. ProgressBlock |
| [RedactedThinkingBlock](@uaito.sdk.Interface.RedactedThinkingBlock.md) | Represents a thinking or reasoning block from the model that has been redacted. RedactedThinkingBlock |
| [SearchReplaceBlock](@uaito.sdk.Interface.SearchReplaceBlock.md) | Represents a block for search and replace operations. SearchReplaceBlock |
| [ServerToolUseBlock](@uaito.sdk.Interface.ServerToolUseBlock.md) | Represents a block for a tool that is executed on the server-side. ServerToolUseBlock |
| [SignatureDeltaBlock](@uaito.sdk.Interface.SignatureDeltaBlock.md) | Represents a delta block for a signature. SignatureDeltaBlock |
| [ThinkingBlock](@uaito.sdk.Interface.ThinkingBlock.md) | Represents a block containing the model's thinking or reasoning process. ThinkingBlock |
| [WebSearchResultBlock](@uaito.sdk.Interface.WebSearchResultBlock.md) | Represents a web search result block. WebSearchResultBlock |
| [WebSearchToolResultBlock](@uaito.sdk.Interface.WebSearchToolResultBlock.md) | Represents the result block from a web search tool. WebSearchToolResultBlock |
| [WebSearchToolResultError](@uaito.sdk.Interface.WebSearchToolResultError.md) | Represents an error that occurred during a web search tool execution. WebSearchToolResultError |

## Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ArrayElementType](@uaito.sdk.TypeAlias.ArrayElementType.md) | A utility type to extract the element type from an array. |
| [AudioBlock](@uaito.sdk.TypeAlias.AudioBlock.md) | Represents a block containing audio. |
| [BaseLLMCache](@uaito.sdk.TypeAlias.BaseLLMCache.md) | Defines the structure for a cache used by a `BaseLLM` instance. This can be used to store intermediate data like partial tool inputs or response chunks. |
| [BaseLLMOptions](@uaito.sdk.TypeAlias.BaseLLMOptions.md) | Configuration options for a `BaseLLM` instance. |
| [BlockType](@uaito.sdk.TypeAlias.BlockType.md) | A union of all possible block types that can be part of a message's content. |
| [DeltaBlock](@uaito.sdk.TypeAlias.DeltaBlock.md) | Represents a delta block in a streamed response, indicating changes or stop reasons. |
| [ErrorBlock](@uaito.sdk.TypeAlias.ErrorBlock.md) | Represents a block containing an error message. |
| [FileBlock](@uaito.sdk.TypeAlias.FileBlock.md) | Represents a block containing a file. |
| [ImageBlock](@uaito.sdk.TypeAlias.ImageBlock.md) | Represents a block containing an image. |
| [Message](@uaito.sdk.TypeAlias.Message.md) | The core message structure used throughout the SDK. |
| [MessageContent](@uaito.sdk.TypeAlias.MessageContent.md) | A union type representing any of the possible content blocks within a message's `content` array. |
| [MessageInput](@uaito.sdk.TypeAlias.MessageInput.md) | Represents the structure of a message when it is being passed as input to an LLM. |
| [MessageType](@uaito.sdk.TypeAlias.MessageType.md) | A union of all possible message types. |
| [OnTool](@uaito.sdk.TypeAlias.OnTool.md) | A callback function that is invoked when an LLM uses a tool. The `this` context within the callback is bound to the `BaseAgent` instance. |
| [ReadableStreamWithAsyncIterable](@uaito.sdk.TypeAlias.ReadableStreamWithAsyncIterable.md) | A type that combines a `ReadableStream` with an `AsyncIterable`, allowing it to be used with both `for await...of` loops and standard stream consumers. |
| [Role](@uaito.sdk.TypeAlias.Role.md) | Represents the role of the message's author. - `user`: The end-user. - `assistant`: The AI model. - `system`: A configuration or instruction message. - `tool`: A message containing the output of a tool. |
| [TextBlock](@uaito.sdk.TypeAlias.TextBlock.md) | Represents a block containing plain text. |
| [Tool](@uaito.sdk.TypeAlias.Tool.md) | Describes a tool that an LLM can use. This structure is used to define the tool's name, purpose, and the schema for its inputs. |
| [ToolBlock](@uaito.sdk.TypeAlias.ToolBlock.md) | A union type representing all possible tool-related blocks in a message. This includes tool inputs, tool usage requests, and tool results. |
| [ToolInputDelta](@uaito.sdk.TypeAlias.ToolInputDelta.md) | Represents a delta in the input of a tool as it's being streamed. |
| [ToolResultBlock](@uaito.sdk.TypeAlias.ToolResultBlock.md) | Represents the result of a tool's execution. |
| [ToolUseBlock](@uaito.sdk.TypeAlias.ToolUseBlock.md) | Represents a block indicating that the model wants to use a tool. |
| [TransformStreamFn](@uaito.sdk.TypeAlias.TransformStreamFn.md) | A function that transforms a chunk of data from a provider's stream into the SDK's standard `Message` format. |
| [USAGE](@uaito.sdk.TypeAlias.USAGE.md) | Represents the token usage for a request. |
| [UsageBlock](@uaito.sdk.TypeAlias.UsageBlock.md) | Represents a block containing token usage information for a request. |
| [WebSearchToolResultBlockContent](@uaito.sdk.TypeAlias.WebSearchToolResultBlockContent.md) | Represents the content of a `WebSearchToolResultBlock`, which can either be an array of `WebSearchResultBlock` or a `WebSearchToolResultError`. |

## Functions

| Function | Description |
| ------ | ------ |
| [blobToDataURL](@uaito.sdk.Function.blobToDataURL.md) | Converts a Blob to a data URL. |
