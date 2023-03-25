<?php

namespace App\Http\Controllers\API\v1\Dashboard\Admin;

use App\Helpers\ResponseError;
use App\Http\Controllers\Controller;
use App\Http\Requests\DeleteAllRequest;
use App\Http\Requests\Refund\StatusUpdateRequest;
use App\Http\Requests\Refund\UpdateRequest;
use App\Http\Resources\RefundResource;
use App\Repositories\RefundRepository\RefundRepository;
use App\Services\RefundService\RefundService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class RefundController extends Controller
{
    use ApiResponse;

    private RefundService $service;
    private RefundRepository $repository;

    public function __construct(RefundRepository $repository, RefundService $service)
    {
        $this->service = $service;
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource with paginate.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */

    public function index(Request $request): AnonymousResourceCollection
    {
        $refunds = $this->repository->paginate($request->perPage ?? 15);
        return RefundResource::collection($refunds);
    }

    /**
     * @param int $id
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function show(int $id)
    {
        $refund = $this->repository->show($id);

        if ($refund) {
            return $this->successResponse(__('errors.' . ResponseError::NO_ERROR), RefundResource::make($refund));
        }

        return $this->errorResponse(
            ResponseError::ERROR_404, trans('errors.' . ResponseError::ERROR_404, [], request()->lang),
            Response::HTTP_NOT_FOUND
        );
    }

    /**
     * @param UpdateRequest $request
     * @param int $id
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function update(UpdateRequest $request, int $id)
    {
        $collection = $request->validated();

        $result = $this->service->update($collection, $id);

        if ($result['status']) {
            return $this->successResponse(__('web.record_successfully_update'), RefundResource::make($result['data']));
        }
        return $this->errorResponse(
            $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * @param StatusUpdateRequest $request
     * @param int $id
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function statusChange(StatusUpdateRequest $request, int $id)
    {
        $collection = $request->validated();

        $result = $this->service->statusChange($collection, $id);

        if ($result['status']) {
            return $this->successResponse(__('web.record_successfully_update'), RefundResource::make($result['data']));
        }
        return $this->errorResponse(
            $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param DeleteAllRequest $request
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function destroy(DeleteAllRequest $request)
    {
        $collection = $request->validated();

        $result = $this->service->delete($collection['ids']);

        if ($result['status']) {
            return $this->successResponse(__('web.record_has_been_successfully_delete'));
        }
        return $this->errorResponse(
            $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }

    public function statistics()
    {
        $statistics = $this->repository->statisticsAdmin($this->shop);
        return $this->successResponse(__('web.record_has_been_successfully_found'), $statistics);
    }
}
