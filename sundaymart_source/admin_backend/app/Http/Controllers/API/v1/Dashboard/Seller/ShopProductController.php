<?php

namespace App\Http\Controllers\API\v1\Dashboard\Seller;

use App\Exports\ShopProductExport;
use App\Helpers\ResponseError;
use App\Http\Requests\DeleteAllRequest;
use App\Http\Requests\Product\FileImportRequest;
use App\Http\Requests\ShopProduct\StoreRequest;
use App\Http\Requests\ShopProduct\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ShopProductResource;
use App\Http\Resources\ShopProductSelectResource;
use App\Imports\ShopProductImport;
use App\Repositories\ProductRepository\ProductRepository;
use App\Repositories\ShopProductRepository\ShopProductRepository;
use App\Services\ShopProductService\ShopProductService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;

class ShopProductController extends SellerBaseController
{
    private ShopProductRepository $shopProductRepository;
    private ShopProductService $shopProductService;
    private ProductRepository $productRepository;

    public function __construct(ShopProductRepository $shopProductRepository, ShopProductService $shopProductService, ProductRepository $productRepository)
    {
        parent::__construct();
        $this->shopProductRepository = $shopProductRepository;
        $this->shopProductService = $shopProductService;
        $this->productRepository = $productRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        if ($this->shop) {

            $shopProducts = $this->shopProductRepository->paginate($this->shop->id, $request->all());

            return ShopProductResource::collection($shopProducts);

        }

        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], request('lang')),
            Response::HTTP_BAD_REQUEST
        );
    }
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function selectProducts(Request $request)
    {
        if ($this->shop) {

            $shopProducts = $this->shopProductRepository->selectProducts($this->shop->id, $request->all());

            return ShopProductSelectResource::collection($shopProducts);
        }

        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], request('lang')),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function show(int $id)
    {
        if ($this->shop) {

            $shopProduct = $this->shopProductRepository->getById($id, $this->shop->id);

            return $this->successResponse(__('web.record_successfully_found'), $shopProduct);
        }

        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], request('lang')),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $collection = $request->validated();

        if ($this->shop) {
            $collection['shop_id'] = $this->shop->id;
            $result = $this->shopProductService->create($collection);

            if ($result['status']) {
                return $this->successResponse(__('web.record_successfully_created'), $result['data']);
            }

            return $this->errorResponse(
                $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], request('lang')),
                Response::HTTP_BAD_REQUEST
            );
        }

        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], request('lang')),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateRequest $request, int $id): JsonResponse
    {

        $collection = $request->validated();
        if ($this->shop) {
            $collection['shop_id'] = $this->shop->id;
            $result = $this->shopProductService->update($collection, $id);
            if ($result['status']) {
                return $this->successResponse(__('web.record_successfully_updated'), $result['data']);
            }
            return $this->errorResponse(
                $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
                Response::HTTP_BAD_REQUEST
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
            $result = $this->shopProductService->delete($collection['ids']);
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

    public function allProduct(Request $request)
    {
        if ($this->shop) {
            $product = $this->productRepository->shopProductNonExistPaginate($this->shop->id, $request->all(), $request->perPage ?? 15);
            if ($product) {
            return ProductResource::collection($product);
            }
            return $this->errorResponse(
                ResponseError::ERROR_404, __('errors.' . ResponseError::ERROR_404, [], \request()->lang),
                Response::HTTP_NOT_FOUND
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }

    public function getByUuid($uuid)
    {
        if ($this->shop) {
            $product = $this->productRepository->productByUUID($uuid);
            if ($product) {
                return $this->successResponse(__('web.record_successfully_found'), ProductResource::make($product));
            }
            return $this->errorResponse(
                ResponseError::ERROR_404, __('errors.' . ResponseError::ERROR_404, [], \request()->lang),
                Response::HTTP_NOT_FOUND
            );
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function fileExport()
    {
        if ($this->shop) {
            $fileName = 'export/shop-products.xls';
            $file = Excel::store(new ShopProductExport($this->shop), $fileName, 'public');
            if ($file) {
                return $this->successResponse('Successfully exported', [
                    'path' => 'public/export',
                    'file_name' => $fileName
                ]);
            }
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        }

        return $this->errorResponse('Error during export');
    }

    public function fileImport(FileImportRequest $request)
    {
        $collection = $request->validated();
        if ($this->shop) {
            try {
                Excel::import(new ShopProductImport(), $collection['file']);
                return $this->successResponse('Successfully imported');
            } catch (Exception $exception) {
                return $this->errorResponse(ResponseError::ERROR_508, 'Excel format incorrect or data invalid');
            }
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        }
    }



}
