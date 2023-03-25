<?php

namespace App\Http\Requests\Admin\Product;

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
            'category_id' => 'required|integer|exists:categories,id',
            'brand_id' => 'required|integer|exists:brands,id',
            'unit_id' => 'required|integer|exists:units,id',
            'keywords' => 'nullable|string',
            'images' => 'required|array',
            'qr_code' => 'required|string|unique:products,qr_code',
            'title' => 'required|array',
            'description' => 'required|array',
            'min_qty' => 'required|numeric',
            'max_qty' => 'required|numeric',
            'active' => 'required|boolean',
            'quantity' => 'required|numeric',
            'price' => 'required|numeric',
            'tax' => 'required|numeric',
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
