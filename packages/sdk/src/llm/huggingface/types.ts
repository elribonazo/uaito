import { Tensor } from "@huggingface/transformers";

export type TensorDataType = {
    input_ids: Tensor;
    attention_mask: Tensor;
    token_type_ids?: Tensor;
}