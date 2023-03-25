<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseError;
use App\Services\ProjectService\ProjectService;
use App\Traits\ApiResponse;
use Closure;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanctumCheck
{
    use ApiResponse;
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return JsonResponse
     * @throws Exception
     */
    public function handle(Request $request, Closure $next)
    {
        if (!cache()->has('project.status') || cache('project.status')->active != 1){
            return $this->errorResponse('ERROR_403',  trans('errors.' . ResponseError::ERROR_403, [], request()->lang ?? 'en'), Response::HTTP_UNAUTHORIZED);
        }
        if (auth('sanctum')->check()) {
            return $next($request);
        }
        return $this->errorResponse('ERROR_100',  trans('errors.' . ResponseError::ERROR_100, [], request()->lang), Response::HTTP_UNAUTHORIZED);
    }
}
