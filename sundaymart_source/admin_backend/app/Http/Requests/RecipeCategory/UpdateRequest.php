<?php

namespace App\Http\Requests\RecipeCategory;

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
            'status' => 'boolean',
            'parent_id' => 'integer|exists:recipe_categories,id',
            'title' => 'required|array',
            'image' => 'string',
            'description' => 'required|array'
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