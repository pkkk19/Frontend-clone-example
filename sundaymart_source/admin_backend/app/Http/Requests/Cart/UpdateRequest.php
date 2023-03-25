<?php

namespace App\Http\Requests\Cart;

use App\Helpers\ResponseError;
use App\Traits\ApiResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

class UpdateRequest extends FormRequest
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
            'shop_id' => 'required|integer|exists:shops,id',
            'user_id' => 'required|integer|exists:users,id',
            'total_price' => 'required|numeric',
            'total_discount' => 'required|numeric',
            'shop_product_id' => 'required|integer|exists:shop_products,id',
            'price' => 'required|numeric',
            'quantity' => 'required|numeric',
            'discount' => 'nullable|numeric',
        ];
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
            'numeric' => trans('validation.numeric', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
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
