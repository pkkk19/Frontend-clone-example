<?php

namespace App\Http\Controllers\API\v1\Dashboard\Seller;

use App\Exports\ProductsExport;
use App\Helpers\ResponseError;
use App\Http\Requests\Admin\Product\StoreRequest;
use App\Http\Requests\Admin\Product\UpdateRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ShopProductSearchResource;
use App\Models\Product;
use App\Models\ShopProduct;
use App\Repositories\Interfaces\ProductRepoInterface;
use App\Services\ProductService\ProductAdditionalService;
use App\Services\ProductService\ProductService;
use App\Services\SellerProductService\SellerProductService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;

class ProductController extends SellerBaseController
{
    private ProductService $productService;
    private ProductRepoInterface $productRepository;
    private SellerProductService $sellerProductService;

    /**
     * @param ProductService $productService
     * @param ProductRepoInterface $productRepository
     * @param SellerProductService $sellerProductService
     */
    public function __construct(ProductService $productService, ProductRepoInterface $productRepository,SellerProductService $sellerProductService)
    {
        parent::__construct();
        $this->productService = $productService;
        $this->productRepository = $productRepository;
        $this->sellerProductService = $sellerProductService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function paginate(Request $request)
    {
        if ($this->shop) {

            $products = $this->productRepository->productsPaginate($request->perPage ?? 15, $request->active ?? null, $request->all() + ['shop_id' => $this->shop->id]);

            return ProductResource::collection($products);
        }

        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
            Response::HTTP_FORBIDDEN
        );
    }

    /**
     * Store a newly created resource in storage.
     * @param StoreRequest $request
     * @return JsonResponse
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $collection = $request->validated();

        if (!$this->shop) {
            return $this->errorResponse(
                ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }

        $result = $this->sellerProductService->create($collection,$this->shop->id);

        if ($result['status']) {
            return $this->successResponse( __('web.record_was_successfully_create'), ProductResource::make($result['data']));
        }

        return $this->errorResponse(
            $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * Display the specified resource.
     *
     * @param string $uuid
     * @return JsonResponse
     */
    public function show(string $uuid): JsonResponse
    {
        if (!$this->shop) {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }

        $product = $this->productRepository->productByUUID($uuid);

        if ($product) {
            return $this->successResponse(__('web.product_found'), ProductResource::make($product->load('translations')));
        }

        return $this->errorResponse(
            ResponseError::ERROR_404, trans('errors.' . ResponseError::ERROR_404, [], request()->lang),
            Response::HTTP_NOT_FOUND
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

        if (!$this->shop) {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }

        $product = Product::find($id);

        if (!$product) {
            return $this->errorResponse(
                ResponseError::ERROR_404, __('errors.' . ResponseError::ERROR_404, [], \request()->lang),
                Response::HTTP_NOT_FOUND
            );
        }

        $collection['shop_id'] = $this->shop->id;
        $result = $this->sellerProductService->update($product, $collection);

        if ($result['status']) {
            return $this->successResponse(
                __('web.record_was_successfully_update'),
                ProductResource::make($result['data'])
            );
        }

        return $this->errorResponse(
            $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
            Response::HTTP_BAD_REQUEST
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $uuid
     * @return JsonResponse
     */
    public function destroy(string $uuid)
    {
        if ($this->shop) {
            $product = Product::firstWhere('uuid', $uuid);
            if ($product && $product->shop_id == $this->shop->id){
                $result = $this->productService->delete($product->uuid);

                if ($result['status']) {
                    return $this->successResponse(__('web.record_has_been_successfully_delete'));
                }
                return $this->errorResponse(
                    $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                    Response::HTTP_BAD_REQUEST
                );
            } else {
                return $this->errorResponse(
                    ResponseError::ERROR_404, __('errors.' . ResponseError::ERROR_404, [], \request()->lang),
                    Response::HTTP_NOT_FOUND
                );
            }
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }


    }

    /**
     * Add Product Properties.
     *
     * @param string $uuid
     * @param Request $request
     * @return JsonResponse
     */
    public function addProductProperties(string $uuid, Request $request)
    {
        if ($this->shop) {
            $product = Product::firstWhere('uuid', $uuid);
            if ($product){
                $result = (new ProductAdditionalService())->createOrUpdateProperties($product->uuid, $request->all());

                if ($result['status']) {
                    return $this->successResponse(__('web.record_has_been_successfully_created'), ProductResource::make($result['data']));
                }
                return $this->errorResponse(
                    $result['code'], $result['message'] ?? trans('errors.' . $result['code'], [], \request()->lang),
                    Response::HTTP_BAD_REQUEST
                );
            } else {
                return $this->errorResponse(
                    ResponseError::ERROR_404, __('errors.' . ResponseError::ERROR_404, [], \request()->lang),
                    Response::HTTP_NOT_FOUND
                );
            }
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }

    /**
     * Search Model by tag name.
     *
     * @param Request $request
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function productsSearch(Request $request)
    {

        if ($this->shop) {
            $shopProducts = $this->productRepository->shopProductsSearch($request->input('perPage', 15), true, $request->merge(['shop' => $this->shop])->all());
            return ShopProductSearchResource::collection($shopProducts);
        }

        return $this->errorResponse(
            ResponseError::ERROR_101, __('errors.' . ResponseError::ERROR_101, [], \request()->lang),
            Response::HTTP_FORBIDDEN
        );
    }

    /**
     * Change Active Status of Model.
     *
     * @param string $uuid
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function setActive(string $uuid)
    {

        if (!$this->shop) {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }

        $shopProduct = ShopProduct::firstWhere('uuid', $uuid);

        if (!empty($shopProduct) && $shopProduct->shop_id == $this->shop->id) {

            $shopProduct->update(['active' => !$shopProduct->active]);

            return $this->successResponse(
                __('web.record_has_been_successfully_updated'),
                ProductResource::make($shopProduct)
            );
        }

        return $this->errorResponse(
            ResponseError::ERROR_404, __('errors.' . ResponseError::ERROR_404, [], \request()->lang),
            Response::HTTP_NOT_FOUND
        );
    }

    public function fileExport()
    {
        if ($this->shop) {
            $shop_id = $this->shop->id;
            $time = Str::slug(Carbon::now()->format('Y-m-d h:i:s'));
            $fileName = 'export/' . $time . '-products.xlsx';

            $file = Excel::store(new ProductsExport($shop_id), $fileName, 'public');
            if ($file) {
                return $this->successResponse('Successfully exported', [
                    'path' => 'public/export',
                    'file_name' => 'public/' . $fileName
                ]);
            }
            return $this->errorResponse('Error during export');
        } else {
            return $this->errorResponse(
                ResponseError::ERROR_204, __('errors.' . ResponseError::ERROR_204, [], \request()->lang),
                Response::HTTP_FORBIDDEN
            );
        }
    }
}
