<?php

namespace App\Http\Controllers\API\v1\Dashboard\Admin;

use App\Helpers\ResponseError;
use App\Http\Controllers\Controller;
use App\Models\TermCondition;
use App\Services\TermService\TermService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class TermsController extends AdminBaseController
{
    private TermCondition $model;
    private TermService $service;
    /**
     * @var array|Application|Request|string
     */
    private $lang;

    public function __construct(TermCondition $model,TermService $service)
    {
        parent::__construct();
        $this->model = $model;
        $this->service = $service;
        $this->lang = request('lang') ?? 'en';
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param $type
     * @param Request $request
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function store(Request $request)
    {
        $this->model::query()->delete();
        $condition = $this->service->create($request);
        if ($condition['status']) {
            return $this->successResponse(__('web.record_has_been_successfully_created'), $condition['data']);
        }
        return $this->errorResponse(
            ResponseError::ERROR_501, trans('errors.' . ResponseError::ERROR_501, [], \request()->lang ?? 'en'),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * Display the specified resource.
     *
     * @param $type
     * @return JsonResponse
     */
    public function show()
    {
        $model = $this->model->with(['translation' => fn($q) => $q->where('locale', $this->lang),'translations'])->first();
        if ($model){
            return $this->successResponse(__('web.model_found'), $model);
        }
        return $this->errorResponse(
            ResponseError::ERROR_404, trans('errors.' . ResponseError::ERROR_404, [], request()->lang ?? 'en'),
            Response::HTTP_NOT_FOUND
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param $type
     * @return JsonResponse
     */
    public function update($id, Request $request)
    {
        $term = $this->service->update($id,$request);
        if ($term['status']){
            return $this->successResponse(__('web.record_has_been_successfully_updated'), $term);
        }
        return $this->errorResponse(
            ResponseError::ERROR_404, trans('errors.' . ResponseError::ERROR_404, [], request()->lang ?? 'en'),
            Response::HTTP_NOT_FOUND
        );
    }

}
