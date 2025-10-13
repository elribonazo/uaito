import type { BaseLLMOptions } from "@uaito/sdk";
import type { Tensor } from "@huggingface/transformers";

/**
 * Defines the structure of tensor data required by Hugging Face models,
 * including input IDs, attention mask, and optional token type IDs.
 * @type
 */
export type TensorDataType = {
    /**
     * The input IDs tensor.
     * @type {Tensor}
     */
    input_ids: Tensor;
    /**
     * The attention mask tensor.
     * @type {Tensor}
     */
    attention_mask: Tensor;
    /**
     * Optional tensor for token type IDs, used in models that distinguish between different sentences.
     * @type {(Tensor | undefined)}
     */
    token_type_ids?: Tensor;
}
/**
 * An enumeration of the available Hugging Face ONNX models that are optimized for web execution.
 * These models are suitable for running locally in the browser with WebGPU or WASM.
 * @enum {string}
 */
export enum HuggingFaceONNXModels {
    JANO = "onnx-community/Jan-nano-ONNX",

    
    LUCY="onnx-community/Lucy-ONNX",
    LUCY_128K='onnx-community/Lucy-128k-ONNX',

    GRANITE="onnx-community/granite-4.0-micro-ONNX-web",
    
    GEMMA3='onnx-community/gemma-3-1b-it-ONNX-GQA'

  }

  /**
   * An enumeration of chat templates for formatting conversation history.
   * These templates are specific to certain Hugging Face models and ensure that
   * the input is structured correctly for the model to understand.
   * @enum {string}
   */
  export enum HuggingFaceONNXChatTemplates {
    /**
     * A chat template for the LFM2 model series.
     */
    LFM2=`{{- bos_token -}}{%- set system_prompt = "" -%}{%- set ns = namespace(system_prompt="") -%}{%- if messages[0]["role"] == "system" -%} {%- set ns.system_prompt = messages[0]["content"] -%} {%- set messages = messages[1:] -%}{%- endif -%}{%- if tools -%} {%- set ns.system_prompt = ns.system_prompt + ("
" if ns.system_prompt else "") + "List of tools: <|tool_list_start|>[" -%} {%- for tool in tools -%} {%- if tool is not string -%} {%- set tool = tool | tojson -%} {%- endif -%} {%- set ns.system_prompt = ns.system_prompt + tool -%} {%- if not loop.last -%} {%- set ns.system_prompt = ns.system_prompt + ", " -%} {%- endif -%} {%- endfor -%} {%- set ns.system_prompt = ns.system_prompt + "]<|tool_list_end|>" -%}{%- endif -%}{%- if ns.system_prompt -%} {{- "<|im_start|>system
" + ns.system_prompt + "<|im_end|>
" -}}{%- endif -%}{%- for message in messages -%} {{- "<|im_start|>" + message["role"] + "
" -}} {%- set content = message["content"] -%} {%- if content is not string -%} {%- set content = content | tojson -%} {%- endif -%} {%- if message["role"] == "tool" -%} {%- set content = "<|tool_response_start|>" + content + "<|tool_response_end|>" -%} {%- endif -%} {{- content + "<|im_end|>
" -}}{%- endfor -%}{%- if add_generation_prompt -%} {{- "<|im_start|>assistant
" -}}{%- endif -%}`,
    /**
     * A chat template for a medical notes model.
     */
    MED=`{{- bos_token }}
{%- if custom_tools is defined %}
    {%- set tools = custom_tools %}
{%- endif %}
{%- if not tools_in_user_message is defined %}
    {%- set tools_in_user_message = true %}
{%- endif %}
{%- if not date_string is defined %}
    {%- if strftime_now is defined %}
        {%- set date_string = strftime_now("%d %b %Y") %}
    {%- else %}
        {%- set date_string = "26 Jul 2024" %}
    {%- endif %}
{%- endif %}
{%- if not tools is defined %}
    {%- set tools = none %}
{%- endif %}

{#- This block extracts the system message, so we can slot it into the right place. #}
{%- if messages[0]['role'] == 'system' %}
    {%- set system_message = messages[0]['content']|trim %}
    {%- set messages = messages[1:] %}
{%- else %}
    {%- set system_message = "" %}
{%- endif %}

{#- System message #}
{{- "<|start_header_id|>system<|end_header_id|>\n\n" }}
{%- if tools is not none %}
    {{- "Environment: ipython\n" }}
{%- endif %}
{{- "Cutting Knowledge Date: December 2023\n" }}
{{- "Today Date: " + date_string + "\n\n" }}
{%- if tools is not none and not tools_in_user_message %}
    {{- "You have access to the following functions. To call a function, please respond with JSON for a function call." }}
    {{- 'Respond in the format {"name": function name, "parameters": dictionary of argument name and its value}.' }}
    {{- "Do not use variables.\n\n" }}
    {%- for t in tools %}
        {{- t | tojson(indent=4) }}
        {{- "\n\n" }}
    {%- endfor %}
{%- endif %}
{{- system_message }}
{{- "<|eot_id|>" }}

{#- Custom tools are passed in a user message with some extra guidance #}
{%- if tools_in_user_message and not tools is none %}
    {#- Extract the first user message so we can plug it in here #}
    {%- if messages | length != 0 %}
        {%- set first_user_message = messages[0]['content']|trim %}
        {%- set messages = messages[1:] %}
    {%- else %}
        {{- raise_exception("Cannot put tools in the first user message when there's no first user message!") }}
{%- endif %}
    {{- '<|start_header_id|>user<|end_header_id|>\n\n' -}}
    {{- "Given the following functions, please respond with a JSON for a function call " }}
    {{- "with its proper arguments that best answers the given prompt.\n\n" }}
    {{- 'Respond in the format {"name": function name, "parameters": dictionary of argument name and its value}.' }}
    {{- "Do not use variables.\n\n" }}
    {%- for t in tools %}
        {{- t | tojson(indent=4) }}
        {{- "\n\n" }}
    {%- endfor %}
    {{- first_user_message + "<|eot_id|>"}}
{%- endif %}

{%- for message in messages %}
    {%- if not (message.role == 'ipython' or message.role == 'tool' or 'tool_calls' in message) %}
        {{- '<|start_header_id|>' + message['role'] + '<|end_header_id|>\n\n'+ message['content'] | trim + '<|eot_id|>' }}
    {%- elif 'tool_calls' in message %}
        {%- if not message.tool_calls|length == 1 %}
            {{- raise_exception("This model only supports single tool-calls at once!") }}
        {%- endif %}
        {%- set tool_call = message.tool_calls[0].function %}
        {{- '<|start_header_id|>assistant<|end_header_id|>\n\n' -}}
        {{- '{"name": "' + tool_call.name + '", ' }}
        {{- '"parameters": ' }}
        {{- tool_call.arguments | tojson }}
        {{- "}" }}
        {{- "<|eot_id|>" }}
    {%- elif message.role == "tool" or message.role == "ipython" %}
        {{- "<|start_header_id|>ipython<|end_header_id|>\n\n" }}
        {%- if message.content is mapping or message.content is iterable %}
            {{- message.content | tojson }}
        {%- else %}
            {{- message.content }}
        {%- endif %}
        {{- "<|eot_id|>" }}
    {%- endif %}
{%- endfor %}
{%- if add_generation_prompt %}
    {{- '<|start_header_id|>assistant<|end_header_id|>\n\n' }}
{%- endif %}`
  }
/**
 * Defines the configuration options for the `HuggingFaceONNX` client.
 * It extends `BaseLLMOptions` with properties specific to running ONNX models,
 * such as the model identifier, data type, and execution device.
 * @type
 */
export type HuggingFaceONNXOptions =  BaseLLMOptions & {
    /**
     * The identifier of the Hugging Face ONNX model to use.
     * @type {HuggingFaceONNXModels}
     */
    model: HuggingFaceONNXModels,
    /**
     * The data type (precision) to use for the model, e.g., 'fp32' or 'q4'.
     * Can be a single value or a record specifying different types for different model parts.
     * @type {DType}
     */
    dtype: DType,
    /**
     * The device to run the model on, e.g., 'webgpu' or 'wasm'.
     * Can be a single value or a record specifying different devices for different model parts.
     * @type {("auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined)}
     */
    device: "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm" | "dml" | "webnn" | "webnn-npu" | "webnn-gpu" | "webnn-cpu" | Record<string, "auto" | "webgpu" | "cpu" | "cuda" | "gpu" | "wasm"  | "webnn-cpu"> | undefined
  };
  
  /**
   * A union of possible data types for model quantization and execution.
   * `auto` allows the library to choose the best type based on the model and hardware.
   * Other values specify the precision, like `fp32` (32-bit float) or `q4` (4-bit quantized).
   * @type
   */
  export type DType = "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16" | Record<string, "auto" | "fp32" | "fp16" | "q8" | "int8" | "uint8" | "q4" | "bnb4" | "q4f16"> | undefined
  
  