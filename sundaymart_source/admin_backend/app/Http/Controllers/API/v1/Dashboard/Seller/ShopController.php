<?php

namespace App\Http\Controllers\API\v1\Dashboard\Seller;

use App\Helpers\ResponseError;
use App\Http\Resources\ShopResource;
use App\Repositories\Interfaces\ShopRepoInterface;
use App\Services\Interfaces\ShopServiceInterface;
use App\Services\ShopServices\ShopActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShopController extends SellerBaseController
{
    private ShopRepoInterface $shopRepository;
    private ShopServiceInterface $shopService;

    public function __construct(ShopRepoInterface $shopRepository, ShopServiceInterface $shopService)
    {
        parent::__construct();
        $this->shopRepository = $shopRepository;
        $this->shopService = $shopService;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse|
     */
    public function shopCreate(Request $request)
    {
        if (!$this->shop) {
            $result = $this->shopService->create($request);
            if ($result['status']) {
                auth('sanctum')->user()->invitations()->delete();
                return $this->successResponse(__('web.record_successfully_created'), ShopResource::make($result['data']));
            }
            return $this->errorResponse(
                $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_205, __('errors.' . ResponseError::ERROR_205, [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @return JsonResponse
     */
    public function shopShow(): JsonResponse
    {
        if ($this->shop) {
            $shop = $this->shopRepository->shopDetails($this->shop->uuid);
            return $this->successResponse(
                __('errors.' . ResponseError::NO_ERROR),
                ShopResource::make($shop->load('translations', 'seller.wallet', 'group'))
            );
        }
        return $this->errorResponse(
            ResponseError::ERROR_204,
            __('errors.' . ResponseError::ERROR_204, [], \request()->lang ?? 'en'),
            Response::HTTP_FORBIDDEN
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function shopUpdate(Request $request)
    {
        if ($this->shop) {
            $result = $this->shopService->update($this->shop->uuid, $request);
            if ($result['status']) {
                return $this->successResponse(__('web.record_successfully_updated'), ShopResource::make($result['data']));
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

    public function setVisibilityStatus()
    {
        if ($this->shop) {
            (new ShopActivityService())->changeVisibility($this->shop->uuid);
            return $this->successResponse(__('web.record_successfully_updated'), ShopResource::make($this->shop));
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }

    public function setWorkingStatus()
    {
        if ($this->shop) {
            (new ShopActivityService())->changeOpenStatus($this->shop->uuid);
            return $this->successResponse(__('web.record_successfully_updated'), ShopResource::make($this->shop));
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
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

}
