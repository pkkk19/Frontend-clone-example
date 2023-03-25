<?php

namespace App\Http\Controllers\API\v1\Rest;

use App\Helpers\ResponseError;
use App\Http\Requests\CouponCheckRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use function request;

class CouponController extends RestBaseController
{
    use ApiResponse;
    private $model;

    public function __construct(Coupon $model)
    {
        parent::__construct();
        $this->model = $model;
    }

    /**
     * Handle the incoming request.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function __invoke(CouponCheckRequest $request)
    {
        $shop = $this->model->firstWhere(['shop_id' => $request->shop_id, 'name' => $request->coupon]);
        if ($shop) {
            $coupon = $this->model->checkCoupon($request->coupon)->first();
            if ($coupon) {
                $result = $coupon->orderCoupon()->firstWhere('user_id', $request->user_id);
                if (!$result) {
                    return $this->successResponse(__('web.coupon_found'), CouponResource::make($coupon));
                }
                return $this->errorResponse(ResponseError::ERROR_251, trans('errors.' . ResponseError::ERROR_251, [], request()->lang),
                    Response::HTTP_NOT_FOUND);
            }
            return $this->errorResponse(ResponseError::ERROR_250, trans('errors.' . ResponseError::ERROR_250, [], request()->lang),
                Response::HTTP_NOT_FOUND);
        }
        return $this->errorResponse(ResponseError::ERROR_249, trans('errors.' . ResponseError::ERROR_249, [], request()->lang), Response::HTTP_NOT_FOUND);
    }
}
