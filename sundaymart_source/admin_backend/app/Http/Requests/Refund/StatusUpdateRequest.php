<?php

namespace App\Http\Requests\Refund;

use App\Helpers\ResponseError;
use App\Models\Refund;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class StatusUpdateRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'status' => 'required|string',Rule::in(Refund::STATUS),
        ];
    }

    public function messages(): array
    {
        return [
            'required' => trans('validation.required', [], request()->lang),
            'string' => trans('validation.string', [], request()->lang),
            'in' => trans('validation.in', [], request()->lang),
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
