<?php

namespace App\Http\Requests\Recipe;

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
            'recipe_category_id' => 'required|integer|exists:recipe_categories,id',
            'title' => 'required|array',
            'active_time' => 'nullable|numeric',
            'total_time' => 'nullable|numeric',
            'calories' => 'nullable|numeric',
            'image' => 'nullable|string',
            'instruction' => 'nullable|array',
            'nutrition' => 'nullable|array',
            'products' => 'required|array',
        ];
    }
    public function messages()
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'array' => trans('validation.array', [], request()->lang),
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
