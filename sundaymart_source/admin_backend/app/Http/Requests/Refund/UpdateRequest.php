<?php

namespace App\Http\Requests\Refund;

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
            'order_id' => 'required|integer|exists:orders,id',
            'user_id' => 'required|integer|exists:users,id',
            'status' => 'required|string',
            'message_seller' => 'nullable|string',
            'message_user' => 'nullable|string',
            'images' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'integer' => trans('validation.integer', [], request()->lang),
            'exists' => trans('validation.exists', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
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
