<?php

namespace App\Http\Requests\Seller\BonusShop;

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
            'bonus_product_id' => 'required|integer|exists:shop_products,id',
            'bonus_quantity' => 'required|integer',
            'order_amount' => 'required|numeric',
            'expired_at' => 'required|date_format:Y-m-d',
        ];
    }

    public function messages()
    {
        return [
            'integer' => trans('validation.integer', [], request()->lang),
            'required' => trans('validation.required', [], request()->lang),
            'date_format' => trans('validation.date_format', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
            'numeric' => trans('validation.numeric', [], request()->lang),
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
