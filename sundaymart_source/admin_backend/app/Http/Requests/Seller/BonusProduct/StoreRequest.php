<?php

namespace App\Http\Requests\Seller\BonusProduct;

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
            'shop_product_id' => 'required|integer|exists:shop_products,id',
            'bonus_product_id' => 'required|integer|exists:shop_products,id',
            'bonus_quantity' => 'required|numeric',
            'shop_product_quantity' => 'required|numeric',
            'expired_at' => 'required|date_format:Y-m-d',
            'status' => 'required|boolean'
        ];
    }

    public function messages()
    {
        return [
            'integer' => trans('validation.integer', [], request()->lang),
            'required' => trans('validation.required', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
            'numeric' => trans('validation.numeric', [], request()->lang),
            'expired_at' => trans('validation.date_format', [], request()->lang),
            'boolean' => trans('validation.boolean', [], request()->lang),
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
