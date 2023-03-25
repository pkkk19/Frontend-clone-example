<?php

namespace App\Http\Middleware;

use App\Helpers\ResponseError;
use App\Services\ProjectService\ProjectService;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class TrustLicence
{
    use ApiResponse;
    const TTL = 604800; // 7 days
    protected $allowRoutes = [
        'api/v1/install/*',
    ];

    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return JsonResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $response = Cache::remember('project.status', self::TTL, function (){
            $response = (new ProjectService())->activationKeyCheck();
            $response = json_decode($response);
            if ($response->key == config('credential.purchase_code') && $response->active){
                return $response;
            }
        });
        foreach ($this->allowRoutes as $allowed_route) {
            if ($request->is($allowed_route) || ($response != null && $response->local) || ($response != null && $response->key == config('credential.purchase_code') && $response->active)) {
               return $next($request);
            }
        }
        return $this->errorResponse(ResponseError::ERROR_403, __('errors.ERROR_403'),  Response::HTTP_FORBIDDEN);
    }
}
