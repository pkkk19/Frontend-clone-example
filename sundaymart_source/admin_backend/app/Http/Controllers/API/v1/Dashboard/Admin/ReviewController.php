<?php

namespace App\Http\Controllers\API\v1\Dashboard\Admin;

use App\Helpers\ResponseError;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\ShopProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReviewController extends AdminBaseController
{
    private Review $model;

    /**
     * @param Review $model
     */
    public function __construct(Review $model)
    {
        parent::__construct();
        $this->model = $model;
    }

    public function paginate(Request $request)
    {
        $reviews = $this->model->with(['reviewable', 'user'])
            ->when(isset($request->type) && $request->type == 'order', function ($q) {
                $q->whereHasMorph('reviewable', Order::class);
            })
            ->when(isset($request->type) && $request->type == 'product', function ($q) {
                $q->whereHasMorph('reviewable', ShopProduct::class);
            })
            ->orderBy($request->column ?? 'id', $request->sort ?? 'desc')
            ->paginate($request->perPage ?? 15);

        return ReviewResource::collection($reviews);
    }

    public function show(int $id)
    {
        $review = $this->model->with(['reviewable', 'galleries', 'user'])->find($id);
        if ($review) {
            return $this->successResponse(__('web.review_found'), ReviewResource::make($review));
        }
        return $this->errorResponse(
            ResponseError::ERROR_404,  trans('errors.' . ResponseError::ERROR_404, [], request()->lang),
            Response::HTTP_NOT_FOUND
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->model->find($id);

        if ($result) {
            $result->delete();
            return $this->successResponse(__('web.record_has_been_successfully_delete'));
        }
        return $this->errorResponse(
            ResponseError::ERROR_404,  trans('errors.' . ResponseError::ERROR_404, [], request()->lang),
            Response::HTTP_NOT_FOUND
        );
    }

}
