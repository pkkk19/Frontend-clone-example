<?php

namespace App\Http\Controllers\API\v1\Dashboard\Seller;

use App\Helpers\ResponseError;
use App\Http\Requests\DeleteAllRequest;
use App\Http\Requests\ShopPayment\StoreRequest;
use App\Http\Requests\ShopPayment\UpdateRequest;
use App\Http\Resources\PaymentResource;
use App\Repositories\PaymentRepository\PaymentRepository;
use App\Repositories\ShopPaymentRepository\ShopPaymentRepository;
use App\Services\ShopPaymentService\ShopPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ShopPaymentController extends SellerBaseController
{
    private ShopPaymentRepository $shopPaymentRepository;
    private ShopPaymentService $shopPaymentService;
    private PaymentRepository $paymentRepository;

    public function __construct(ShopPaymentRepository $shopPaymentRepository, ShopPaymentService $shopPaymentService, PaymentRepository $paymentRepository)
    {
        parent::__construct();
        $this->shopPaymentRepository = $shopPaymentRepository;
        $this->shopPaymentService = $shopPaymentService;
        $this->paymentRepository = $paymentRepository;
    }

    public function index(Request $request)
    {
        return $this->shopPaymentRepository->paginate($request->perPage, $this->shop->id);

    }

    public function show(int $id)
    {
        if ($this->shop) {
            $shopPayment = $this->shopPaymentRepository->getById($id, $this->shop->id);

            if ($shopPayment) {
                return $this->successResponse(__('web.coupon_found'), $shopPayment);
            }
            return $this->errorResponse(
                ResponseError::ERROR_404, trans('errors.' . ResponseError::ERROR_404, [], request()->lang),
                Response::HTTP_NOT_FOUND
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }

    }

    public function store(StoreRequest $request)
    {
        $collection = $request->validated();
        if ($this->shop) {
            $collection['shop_id'] = $this->shop->id;
            $result = $this->shopPaymentService->create($collection);
            if ($result['status']) {
                return $this->successResponse(__('web.record_successfully_created'), $result['data']);
            }
            return $this->errorResponse(
                $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }

    public function update(UpdateRequest $request, $id)
    {
        $collection = $request->validated();
        if ($this->shop) {

            $collection['shop_id'] = $this->shop->id;

            $result = $this->shopPaymentService->update($collection, $id);

            if ($result['status']) {

                return $this->successResponse(__('web.record_successfully_updated'), $result['data']);

            }

            return $this->errorResponse(
                $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param DeleteAllRequest $request
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function destroy(DeleteAllRequest $request)
    {
        if ($this->shop) {
            $collection = $request->validated();
            $result = $this->shopPaymentService->delete($collection['ids']);
            if ($result['status']) {
                return $this->successResponse(__('web.record_has_been_successfully_delete'));
            }
            return $this->errorResponse(
                $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        }
        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }

    public function allPayment(Request $request)
    {
        if ($this->shop) {
            $payment = $this->paymentRepository->shopPaymentNonExistPaginate($this->shop->id, $request->perPage ?? 10);
            return $this->successResponse(__('web.record_successfully_updated'), PaymentResource::collection($payment));

        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }

}
