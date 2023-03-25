<?php

namespace App\Http\Requests\ShopProduct;

use App\Helpers\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

class StoreRequest extends FormRequest
{
    use ApiResponse;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'product_id' => 'required|integer|exists:products,id',
            'min_qty' => 'required|numeric|gte:0',
            'max_qty' => 'required|numeric|gte:min_qty',
            'active' => 'required|boolean',
            'quantity' => 'required|numeric|gte:0',
            'price' => 'required|numeric',
            'tax' => 'nullable|numeric'
        ];
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
            'boolean' => trans('validation.boolean', [], request()->lang),
            'gte' => trans('validation.gte', [], request()->lang),
        ];
    }

    public function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();
        $response = $this->requestErrorResponse(
            ResponseError::ERROR_400,
            trans('errors.' . ResponseError::ERROR_400, [], request()->lang),
            $errors->messages(), Response::HTTP_BAD_REQUEST);

        throw new HttpResponseException($response);
    }
}
