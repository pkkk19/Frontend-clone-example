<?php

namespace App\Http\Controllers\API\v1;

use App\Helpers\FileHelper;
use App\Helpers\ResponseError;
use App\Http\Controllers\Controller;
use App\Http\Requests\GalleryUploadRequest;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use App\Services\GalleryService\FileStorageService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class GalleryController extends Controller
{
    use ApiResponse;

    private Gallery $model;
    private FileStorageService $storageService;

    public function __construct(Gallery $model, FileStorageService $storageService)
    {
        $this->middleware(['sanctum.check', 'role:admin|seller|moderator|manager|deliveryman'])->except('store');
        $this->model = $model;
        $this->storageService = $storageService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function getStorageFiles()
    {
        $type = \request()->type ?? null;
        $length = \request()->length ?? null;
        $start = \request()->start ?? 0;

        if (!in_array($type, Gallery::TYPES)){
            return $this->errorResponse(ResponseError::ERROR_413, trans('errors.ERROR_413',  [], \request()->lang), Response::HTTP_NOT_FOUND);
        }
        $files = $this->storageService->getStorageFiles($type, $length, $start);
        return $this->successResponse(__('web.list_of_storage_files'), $files);
    }

    /**
     * Destroy a file from the storage.
     *
     * @return JsonResponse
     */
    public function deleteStorageFile(Request $request)
    {
        $result = $this->storageService->deleteFileFromStorage($request->file);
        if ($result['status']){
            return $this->successResponse(trans('web.successfully_deleted',  [], \request()->lang), $result['data']);
        }
        return $this->errorResponse($result['code'], trans('errors.' . $result['code'],  [], \request()->lang), Response::HTTP_NOT_FOUND);

    }

    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function paginate(Request $request)
    {
        $galleries = $this->model->orderByDesc('id')->paginate($request->perPage ?? 15);

        $galleries->map(function ($gallery){
            $file = Storage::disk('public')->exists('/images/' . $gallery->path);
            if ($file){
                $gallery->isset = true;
            }
        });

        return  GalleryResource::collection($galleries);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(GalleryUploadRequest $request)
    {
        if ($request->image) {

            $result = FileHelper::uploadFile($request->image, $request->type ?? 'unknown', 400, 400);

            if ($result['status']) {
                return $this->successResponse(
                    trans('web.image_successfully_uploaded', [], request()->lang),
                    ['title' => $result['data'], 'type' => $request->type]
                );
            }
            return $this->errorResponse($result['code'],
                $result['message'] ?? trans('errors.' . $result['code'], [], request()->lang),
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

}
