<?php

namespace App\Http\Requests\Seller\Discount;

use App\Helpers\ResponseError;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Symfony\Component\HttpFoundation\Response;

class UpdateRequest extends FormRequest
{
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
            'type' => 'required|string|in:fix,percent',
            'price' => 'required|numeric',
            'start' => 'required|date|date_format:Y-m-d',
            'end' => 'required|date|date_format:Y-m-d',
            'products' => 'required|array',
            'images' => 'array'
        ];
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
            'in' => trans('validation.in', [], request()->lang),
            'date' => trans('validation.date', [], request()->lang),
            'date_format' => trans('validation.date_format', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
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
