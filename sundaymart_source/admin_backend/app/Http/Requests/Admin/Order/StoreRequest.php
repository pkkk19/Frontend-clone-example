<?php

namespace App\Http\Requests\Admin\Order;

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
            'currency_id' => 'required|integer|exists:currencies,id',
            'rate' => 'required|integer',
            'shop_id' => 'required|integer|exists:shops,id',
            'delivery_fee' => 'nullable|integer',
            'coupon' => 'nullable|string',
            'delivery_date' => 'required|date|date_format:Y-m-d',
            'delivery_time' => 'nullable|string',
            'delivery_address_id' => 'nullable|integer|exists:user_addresses,id',
            'deliveryman' => 'nullable|integer|exists:users,id',
            'delivery_type_id' => 'required|integer|exists:deliveries,id',
            'note' => 'nullable|string|max:191',
            'products' => 'nullable|array',
            'products.*.shop_product_id' => 'required|numeric',
            'products.*.qty' => 'required|numeric',

        ];
    }
    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
            'numeric' => trans('validation.numeric', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
            'max' => trans('validation.max', [], request()->lang),
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
